export interface StockPayload {
    from: Date,
    to: Date,
    stocks: Stock[],
}

export interface StockInfo {
    date: Date;
    symbol: string;
    open: number;
    close: number;
    dividend: number;
}

export interface Stock {
    symbol: string,
    amount: number
}