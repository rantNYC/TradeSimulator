package com.example.tradesimulator.controller;

import com.example.tradesimulator.model.StockInfo;
import com.example.tradesimulator.model.dto.StockPayloadDto;
import org.reactivestreams.Publisher;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @PostMapping("/stock")
    public Publisher<StockInfo> retrieveStockData(@Valid @RequestBody StockPayloadDto stockPayload) {
        return stockService.retrieveStockInfo(stockPayload);
    }
}
