package com.example.tradesimulator.controller;

import com.example.tradesimulator.model.StockInfo;
import com.example.tradesimulator.model.dto.StockPayloadDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @PostMapping("/stock")
    public ResponseEntity<List<StockInfo>> retrieveStockData(@Valid @RequestBody StockPayloadDto stockPayload) throws Exception {
        List<StockInfo> stocks = stockService.retrieveStockInfo(stockPayload);
        return ResponseEntity.ok(stocks);
    }

}
