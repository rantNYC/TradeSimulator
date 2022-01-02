package com.example.tradesimulator.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StockInfo {

    @JsonProperty
    private List<StockData> data;

    private String ticker;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Entity
    @Table
    @IdClass(StockId.class)
    @ToString(exclude = {"open", "close", "dividend"})
    @EqualsAndHashCode(exclude = {"open", "close", "dividend"})
    public static class StockData {
        @Id
        @JsonProperty
        @Column
        private Date date;
        @Id
        @JsonProperty
        @Column
        private String symbol;
        @JsonProperty
        @Column
        private Double open;
        @JsonProperty
        @Column
        private Double close;
        @JsonProperty
        @Column
        private Double dividend;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class StockId implements Serializable {
        @JsonProperty
        private String symbol;
        @JsonProperty
        private Date date;
    }
}
