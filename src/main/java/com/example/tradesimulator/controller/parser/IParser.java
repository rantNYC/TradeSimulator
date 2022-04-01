package com.example.tradesimulator.controller.parser;

import com.opencsv.exceptions.CsvException;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public interface IParser<Data> {
    List<Data> parse(InputStream data) throws IOException, CsvException;
}
