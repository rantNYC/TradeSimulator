package com.example.tradesimulator.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"amount"})
public class Stock {
    private final String symbol;
    private final int amount;
}
