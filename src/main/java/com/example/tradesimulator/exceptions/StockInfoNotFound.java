package com.example.tradesimulator.exceptions;

import java.util.List;

public class StockInfoNotFound  extends Exception{
    public StockInfoNotFound(String stockName){
        super("Stock " + stockName + " is not found");
    }

    public StockInfoNotFound(List<String> stockNames){
        super("Stocks " + stockNames + " not found");
    }
}
