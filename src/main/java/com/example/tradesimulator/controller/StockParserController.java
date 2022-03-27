package com.example.tradesimulator.controller;

import com.example.tradesimulator.controller.parser.IParser;
import com.example.tradesimulator.model.Stock;
import com.opencsv.exceptions.CsvException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/parser")
public class StockParserController {

    private final IParser<Stock> parser;

    public StockParserController(IParser<Stock> parser) {
        this.parser = parser;
    }

    @PostMapping("/csv")
    public ResponseEntity<List<Stock>> handleFileUpload(@RequestParam("file") MultipartFile file) throws IOException, CsvException {
        List<Stock> stocks = parser.parse(file.getInputStream());
        return ResponseEntity.ok(stocks);
    }
}
