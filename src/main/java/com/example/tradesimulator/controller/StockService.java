package com.example.tradesimulator.controller;

import com.example.tradesimulator.model.StockInfo;
import com.example.tradesimulator.model.Stock;
import com.example.tradesimulator.model.dto.StockPayloadDto;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.reactivestreams.Publisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.MethodNotAllowedException;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class StockService {

    private final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");


    private final WebClient webClient;
    private final StockRepository stockRepository;

    @Autowired
    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
        HttpClient httpClient = HttpClient.create()
                .doOnConnected(conn -> conn
                        .addHandlerLast(new ReadTimeoutHandler(3000, TimeUnit.MILLISECONDS))
                        .addHandlerLast(new WriteTimeoutHandler(3000, TimeUnit.MILLISECONDS))
                ).option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 3000)
                .responseTimeout(Duration.of(3, ChronoUnit.SECONDS));

        this.webClient = WebClient.builder()
                .baseUrl("http://api.marketstack.com")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .clientConnector(new ReactorClientHttpConnector(httpClient))  // timeout
                .build();
    }


    @SneakyThrows //TODO: REMOVE
    public Publisher<StockInfo> retrieveStockInfo(StockPayloadDto stockPayload) {
        throw new NoSuchMethodException();
    }

    private Mono<StockInfo> retrieveStockInfo(String ticker, Date fromDate, Date toDate) {
        if (fromDate.after(toDate)) {
            return Mono.error(new IllegalArgumentException("From date cannot be after To date"));
        }

        String from = DATE_FORMAT.format(fromDate);
        String to = DATE_FORMAT.format(toDate);

        StockInfo loadedFromDb = loadDataFromDb(ticker, fromDate, toDate);

        if (loadedFromDb.getData() != null && !loadedFromDb.getData().isEmpty()) {
            log.info("Stock {} was found in the database", ticker);
            return Mono.just(loadedFromDb);
        }

        return webClient.get()
                .uri(uriBuilder ->
                        uriBuilder.path("/v1/eod")
                                //TODO: Add to propreties file
                                .queryParam("access_key", "f38058bbc679eec0113e6c62e19ba31a")
                                .queryParam("symbols", ticker)
                                .queryParam("date_from", from)
                                .queryParam("date_to", to)
                                .queryParam("limit", 1000)
                                .build())
                .retrieve()
                .bodyToMono(StockInfo.class)
                .doOnNext(stockInfo -> {
                    for (StockInfo.StockData data : stockInfo.getData()) {
                        stockRepository.save(data);
                        log.info("Successfully saved {}", data);
                    }
                });
    }

    private StockInfo loadDataFromDb(String ticker, Date fromDate, Date toDate) {
        List<StockInfo.StockData> data = new ArrayList<>();
        java.sql.Date start = java.sql.Date.valueOf(fromDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
        java.sql.Date end = java.sql.Date.valueOf(toDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate());

        stockRepository.findAllBySymbol(ticker).ifPresentOrElse(stockList -> {
            int initial = -1;
            int last = -1;
            int index = 0;
            for(StockInfo.StockData stockData : stockList){
                java.sql.Date stockDate = stockData.getDate();
                if(stockDate.equals(start)){
                    initial = index;
                } else if(initial == -1 && ((stockDate.getTime() - start.getTime())/ (1000 * 60 * 60 * 24)) < 3){
                    initial = index;
                }

                if(stockDate.equals(end)){
                    last = index;
                }else if(last == -1 && ((end.getTime() - stockDate.getTime())/ (1000 * 60 * 60 * 24)) < 3){
                    last = index;
                }
                ++index;
            }

            if(initial != -1 && last != -1){
                data.addAll(stockList.subList(last, initial));
            } else{
                log.warn("Stock {} not found from {} to {}", ticker, start, end);
            }
        }, () -> log.warn("Stock {} not found in repository", ticker));

        return new StockInfo(data);
    }
}
