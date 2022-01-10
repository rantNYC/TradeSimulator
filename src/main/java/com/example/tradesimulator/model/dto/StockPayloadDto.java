package com.example.tradesimulator.model.dto;

import com.example.tradesimulator.model.Stock;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
@AllArgsConstructor
public class StockPayloadDto {
    private final String from;
    private final String to;
    private final Set<Stock> stocks;

}
