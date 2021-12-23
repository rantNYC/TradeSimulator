package com.example.tradesimulator.controller;

import com.example.tradesimulator.model.StockInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<StockInfo.StockData, StockInfo.StockId> {
    Optional<List<StockInfo.StockData>> findAllBySymbol(String symbol);
}
