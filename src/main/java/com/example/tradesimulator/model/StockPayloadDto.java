package com.example.tradesimulator.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class StockPayloadDto {
    private final String ticker;
    private final Date from;
    private final Date to;
}
