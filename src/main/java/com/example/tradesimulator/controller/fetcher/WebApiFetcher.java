package com.example.tradesimulator.controller.fetcher;

import com.example.tradesimulator.configuration.StockServiceConfig;
import com.example.tradesimulator.exceptions.StockInfoNotFound;
import com.example.tradesimulator.model.StockInfo;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.concurrent.TimeUnit;

public class WebApiFetcher implements IStockDataFetcher {

    private final WebClient webClient;
    private final StockServiceConfig stockServiceConfig;

    public WebApiFetcher(StockServiceConfig stockServiceConfig) {
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

    @Override
    public StockInfo fetchDataFromSource(String ticker, LocalDate fromDate, LocalDate toDate) throws StockInfoNotFound {
        StockInfo stockInfo = webClient.get()
                .uri(uriBuilder ->
                        uriBuilder.path(stockServiceConfig.getPath())
                                .queryParam("access_key", stockServiceConfig.getAccess_key())
                                .queryParam("symbols", ticker)
                                .queryParam("date_from", fromDate)
                                .queryParam("date_to", toDate)
                                .queryParam("limit", 1000)
                                .build())
                .retrieve()
                .bodyToMono(StockInfo.class).block(Duration.of(stockServiceConfig.getResponse(), ChronoUnit.SECONDS));
        if(stockInfo == null) throw new StockInfoNotFound(ticker);
        stockInfo.setTicker(ticker);
        return stockInfo;
    }
}
