package com.example.tradesimulator.controller.parser;

import com.example.tradesimulator.controller.parser.csv.StockCsvBean;
import com.example.tradesimulator.model.Stock;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.exceptions.CsvException;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
public class StockCsvParser implements IParser<Stock> {

    public StockCsvParser(){
    }

    @Override
    public List<Stock> parse(InputStream data) throws IOException, CsvException {
        return beanBuilder(data).stream().map(StockCsvBean::mapCsvBeanToObject).collect(Collectors.toList());
    }

    private List<StockCsvBean> beanBuilder(InputStream stream) throws IOException {
        try(InputStreamReader reader = new InputStreamReader(stream)){
            CsvToBean<StockCsvBean> cb = new CsvToBeanBuilder<StockCsvBean>(reader)
                    .withType(StockCsvBean.class)
                    .build();
            return cb.parse();
        }
    }
}
