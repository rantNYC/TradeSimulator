package com.example.tradesimulator.controller.parser.csv;

import com.example.tradesimulator.model.Stock;
import com.opencsv.bean.CsvBindByName;
import lombok.*;

@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class StockCsvBean extends CsvBean<Stock> {

    @CsvBindByName(column = "Symbol", required = true)
    String symbol;

    @CsvBindByName(column = "Quantity", required = true)
    double quantity;

    @Override
    public Stock mapCsvBeanToObject() {
        return new Stock(symbol, (int) Math.ceil(quantity));
    }
}
