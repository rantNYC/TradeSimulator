package com.example.tradesimulator.controller;

import com.example.tradesimulator.model.StockInfo;
import org.reactivestreams.Publisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Date;

@RestController
public class StockController {

    private final StockService stockService;

    @Autowired
    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping("/stock")
    public Publisher<StockInfo> retrieveStockData(@RequestParam("ticker") String ticker,
                                                  @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date fromDate,
                                                  @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date toDate){
        return stockService.retrieveStockInfo(ticker, fromDate, toDate);
    }

    @GetMapping("/")
    public Publisher<String> helloWorld(){
        return Mono.just("Hello World");
    }
}
