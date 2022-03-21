package com.example.tradesimulator.model.dto;

import com.example.tradesimulator.model.Stock;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
//TODO: Validate
public class StockPayloadDto {

    private final LocalDate from;
    private final LocalDate to;
    private final List<Stock> stocks;

}
