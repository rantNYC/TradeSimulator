package com.example.tradesimulator.configuration;

import com.example.tradesimulator.controller.fetcher.IStockDataFetcher;
import com.example.tradesimulator.controller.fetcher.WebApiFetcher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataConfiguration {

    @Bean
    public StockServiceConfig getStockServiceConfig(){
        return new StockServiceConfig();
    }

    @Bean
    public IStockDataFetcher dataFetcher(StockServiceConfig stockServiceConfig){
        return new WebApiFetcher(stockServiceConfig);
    }
}
