package com.example.tradesimulator.controller;

import com.example.tradesimulator.model.StockInfo;
import com.example.tradesimulator.model.dto.StockPayloadDto;
import org.reactivestreams.Publisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
public class StockController {

    private final StockService stockService;

    @Autowired
    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @PostMapping("/stock")
    public Publisher<StockInfo> retrieveStockData(@Valid @RequestBody StockPayloadDto stockPayload){
        return stockService.retrieveStockInfo(stockPayload);
    }
}
