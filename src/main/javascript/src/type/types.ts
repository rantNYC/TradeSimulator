export interface StockPayload {
    from: Date,
    to: Date,
    stocks: Stock[],
}

export interface Stock {
    symbol: string,
    amount: number
}