package com.example.tradesimulator.controller.fetcher;

import com.example.tradesimulator.exceptions.StockInfoNotFound;
import com.example.tradesimulator.model.StockInfo;

import java.time.LocalDate;

public interface IStockDataFetcher {
    StockInfo fetchDataFromSource(String ticker, LocalDate fromDate, LocalDate toDate) throws StockInfoNotFound;
}
