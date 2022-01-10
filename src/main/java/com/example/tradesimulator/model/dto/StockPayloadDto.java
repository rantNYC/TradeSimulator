package com.example.tradesimulator.model.dto;

import com.example.tradesimulator.model.Stock;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;
import java.util.Set;

@Data
@AllArgsConstructor
//TODO: Validate
public class StockPayloadDto {

    private final Date from;
    private final Date to;
    private final Set<Stock> stocks;

}
