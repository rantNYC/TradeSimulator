package com.example.tradesimulator.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "webclient.timeout")
public class StockServiceConfig {

    private long read;
    private long write;
    private int connect;
    private long response;
    private String baseUrl;
    private String path;
    private String access_key;
}

