package com.example.tradesimulator.controller;

import com.example.tradesimulator.controller.fetcher.IStockDataFetcher;
import com.example.tradesimulator.model.Stock;
import com.example.tradesimulator.model.StockInfo;
import com.example.tradesimulator.model.dto.StockPayloadDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.ChronoField;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class StockService {

    private final StockRepository stockRepository;
    private final IStockDataFetcher stockDataFetcher;

    public StockService(StockRepository stockRepository, IStockDataFetcher stockDataFetcher) {
        this.stockRepository = stockRepository;
        this.stockDataFetcher = stockDataFetcher;

    }

    public List<StockInfo> retrieveStockInfo(StockPayloadDto stockPayload) throws Exception {
        log.debug("Stock payload:", stockPayload);
        List<StockInfo> results = new ArrayList<>();
        for (Stock stock : stockPayload.getStocks()) {
            results.add(retrieveStockInfo(stock.getSymbol(), stockPayload.getFrom(), stockPayload.getTo()));
        }

        if (results.size() == 0) {
            //TODO: Custom exceptions
            throw new Exception("Stock Results not found");
        }

        return results;
    }

    //TODO: Retrieve name of ticker using api
    //https://api.marketstack.com/v1/tickers?access_key=YOUR_ACCESS_KEY
    private StockInfo retrieveStockInfo(String ticker, LocalDate fromDate, LocalDate toDate) {
        if (!isValidDateRange(fromDate, toDate)) {
            throw new IllegalArgumentException("From date cannot be after To date");
        }

        StockInfo loadedFromDb = loadDataFromDb(ticker, fromDate, toDate);
        if (loadedFromDb.getData() != null && !loadedFromDb.getData().isEmpty()) {
            log.info("Stock {} was found in the database for range {} to {}", ticker, fromDate, toDate);
            return loadedFromDb;
        }

        StockInfo stockInfo = stockDataFetcher.fetchDataFromSource(ticker, fromDate, toDate);
        for (StockInfo.StockData data : stockInfo.getData()) {
            data.setDate(data.getDate().substring(0, 10));
            stockRepository.save(data);
            log.debug("Successfully saved {}", data);
        }

        return stockInfo;
    }

    private boolean isValidDateRange(LocalDate fromDate, LocalDate toDate) {
        return fromDate.isBefore(toDate);
    }

    private StockInfo loadDataFromDb(String ticker, LocalDate start, LocalDate end) {
        List<StockInfo.StockData> data = new ArrayList<>();

        stockRepository.findAllBySymbol(ticker).ifPresentOrElse(stockList -> {
            Map<String, StockInfo.StockData> datesInDb = new HashMap<>();
            for (StockInfo.StockData stockData : stockList) {
                datesInDb.put(stockData.getDate(), stockData);
            }

            boolean storedInDb = true;
            for (LocalDate date = start; !start.isAfter(end) && !date.isAfter(end); date = date.plusDays(1)) {
                if (!isWeekend(date) && !datesInDb.containsKey(date.toString())) {
                    storedInDb = false;
                    data.clear();
                    break;
                } else {
                    data.add(datesInDb.get(date.toString()));
                }
            }

            if (!storedInDb) {
                log.warn("Stock {} not found from {} to {}", ticker, start, end);
            }

        }, () -> log.warn("Stock {} not found in repository", ticker));

        return new StockInfo(data, ticker);
    }

    private static boolean isWeekend(final LocalDate ld) {
        DayOfWeek day = DayOfWeek.of(ld.get(ChronoField.DAY_OF_WEEK));
        return day == DayOfWeek.SUNDAY || day == DayOfWeek.SATURDAY;
    }
}
