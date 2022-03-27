import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppState} from "./Store";
import {Stock} from "../type/StockTypes";

interface StockProps {
    stocks: Stock[],
}

const emptyStock: Stock = {amount: 0, symbol: ""};
const initialStocks: StockProps = {stocks: [emptyStock]};
//TODO: Max number of stocks that can be displayed
const stockSlice = createSlice({
    name: 'Stocks',
    initialState: initialStocks,
    reducers: {
        addStock(state, action: PayloadAction<Stock>) {
            state.stocks = [...state.stocks, action.payload];
        },
        addStocks(state, action: PayloadAction<Stock[]>) {
            state.stocks = action.payload;
        },
        addStockEmpty(state) {
            state.stocks = [...state.stocks, emptyStock];
        },
        removeStock(state, action: PayloadAction<Stock>) {
            state.stocks = state.stocks.filter((value) => value !== action.payload);
        },
        removePosStock(state, action: PayloadAction<number>){
            if (state.stocks.length > 1) {
                state.stocks = state.stocks.filter((value, pos) => pos !== action.payload);
            }
        },
        updateStock(state, action: PayloadAction<{pos: number, data: Stock}>){
            const stocksCopy = [...state.stocks];
            stocksCopy[action.payload.pos] = action.payload.data;
            state.stocks = stocksCopy;
        },
        clearStocks(state) {
            state.stocks = [];
        }
    }
})

export const {clearStocks, removeStock, removePosStock, updateStock, addStockEmpty, addStocks} = stockSlice.actions
export const stockSelector = (state: AppState) => state.stocks.stocks;
export default stockSlice.reducer;