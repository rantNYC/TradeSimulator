package com.example.tradesimulator.controller;

import com.example.tradesimulator.configuration.StockServiceConfig;
import com.example.tradesimulator.model.Stock;
import com.example.tradesimulator.model.StockInfo;
import com.example.tradesimulator.model.dto.StockPayloadDto;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import lombok.extern.slf4j.Slf4j;
import org.reactivestreams.Publisher;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import java.text.ParseException;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoField;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class StockService {

    private final DateTimeFormatter  DATE_FORMAT = DateTimeFormatter.ofPattern(("yyyy-MM-dd"));

    private final WebClient webClient;
    private final StockRepository stockRepository;
    private final StockServiceConfig stockServiceConfig;

    public StockService(StockRepository stockRepository, StockServiceConfig stockServiceConfig) {
        this.stockRepository = stockRepository;
        this.stockServiceConfig = stockServiceConfig;
        HttpClient httpClient = HttpClient.create()
                .doOnConnected(conn -> conn
                        .addHandlerLast(new ReadTimeoutHandler(stockServiceConfig.getRead(), TimeUnit.MILLISECONDS))
                        .addHandlerLast(new WriteTimeoutHandler(stockServiceConfig.getWrite(), TimeUnit.MILLISECONDS))
                ).option(ChannelOption.CONNECT_TIMEOUT_MILLIS, stockServiceConfig.getConnect())
                .responseTimeout(Duration.of(stockServiceConfig.getResponse(), ChronoUnit.SECONDS));

        this.webClient = WebClient.builder()
                .baseUrl(stockServiceConfig.getBaseUrl())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .clientConnector(new ReactorClientHttpConnector(httpClient))  // timeout
                .build();
    }


    public Publisher<StockInfo> retrieveStockInfo(StockPayloadDto stockPayload) {
        List<Publisher<StockInfo>> results = new ArrayList<>();
        for (Stock stock : stockPayload.getStocks()) {
            try {
                results.add(retrieveStockInfo(stock.getSymbol(), stockPayload.getFrom().substring(0,10), stockPayload.getTo().substring(0, 10)));
            } catch (ParseException e) {
                log.error("Error Parsing Date Range for stock:" + stock.getSymbol());
                return Mono.error(e);
            }
        }

        if (results.size() == 0) {
            //TODO: Custom exceptions, B I G Y I K E S
            return Mono.error(new Exception("Stock Results not found"));
        }

        return Flux.merge(results);
    }

    //TODO: Retrieve name of ticker using api
    //https://api.marketstack.com/v1/tickers?access_key=YOUR_ACCESS_KEY
    private Mono<StockInfo> retrieveStockInfo(String ticker, String fromDate, String toDate) throws ParseException {
        if(!isValidDateRange(fromDate, toDate)){
            throw new IllegalArgumentException("From date cannot be after To date");
        }

        StockInfo loadedFromDb = loadDataFromDb(ticker, fromDate, toDate);
        if (loadedFromDb.getData() != null && !loadedFromDb.getData().isEmpty()) {
            log.info("Stock {} was found in the database for range {} to {}", ticker, fromDate, toDate);
            return Mono.just(loadedFromDb);
        }

        return webClient.get()
                .uri(uriBuilder ->
                        uriBuilder.path(stockServiceConfig.getPath())
                                .queryParam("access_key", stockServiceConfig.getAccess_key())
                                .queryParam("symbols", ticker)
                                .queryParam("date_from", fromDate)
                                .queryParam("date_to", toDate)
                                .queryParam("limit", 1000)
                                .build())
                .retrieve()
                .bodyToMono(StockInfo.class)
                .doOnNext(stockInfo -> {
                    stockInfo.setTicker(ticker);
                    for (StockInfo.StockData data : stockInfo.getData()) {
                        data.setDate(data.getDate().substring(0,10));
                        stockRepository.save(data);
                        log.info("Successfully saved {}", data);
                    }
                });
    }

    private boolean isValidDateRange(String fromDate, String toDate) {
        LocalDate from = LocalDate.parse(fromDate, DATE_FORMAT);
        LocalDate to = LocalDate.parse(toDate, DATE_FORMAT);
        return from.isBefore(to);
    }

    private StockInfo loadDataFromDb(String ticker, String fromDate, String toDate) {
       List<StockInfo.StockData> data = new ArrayList<>();
        LocalDate start = LocalDate.parse(fromDate, DATE_FORMAT);
        LocalDate end = LocalDate.parse(toDate, DATE_FORMAT);

        stockRepository.findAllBySymbol(ticker).ifPresentOrElse(stockList -> {
            Map<String, StockInfo.StockData> datesInDb = new HashMap<>();
            for(StockInfo.StockData stockData : stockList){
                datesInDb.put(stockData.getDate(), stockData);
            }

            boolean storedInDb = true;
            for (LocalDate date = start; !start.isAfter(end) && !date.isAfter(end); date = date.plusDays(1)) {
                if(!isWeekend(date) && !datesInDb.containsKey(date.toString())){
                    storedInDb = false;
                    data.clear();
                    break;
                }
                else{
                    data.add(datesInDb.get(date.toString()));
                }
            }

            if (!storedInDb) {
                log.warn("Stock {} not found from {} to {}", ticker, start, end);
            }

        }, () -> log.warn("Stock {} not found in repository", ticker));

        return new StockInfo(data, ticker);
    }

    private static boolean isWeekend(final LocalDate ld) {
        DayOfWeek day = DayOfWeek.of(ld.get(ChronoField.DAY_OF_WEEK));
        return day == DayOfWeek.SUNDAY || day == DayOfWeek.SATURDAY;
    }
}
