import React, {useState} from "react";
import "./Dashboard.scss"
import {Stock, StockPayload} from "../type/StockTypes";
import {useNavigate} from "react-router-dom";
import ErrorDisplay from "../component/ErrorDisplay";
import {MinusCircle, PlusCircle} from "react-feather";
import {useAppDispatch} from "../store/StoreHooks";
import {addError} from "../store/ErrorReducer";

const Dashboard = () => {

    const emptyStock: Stock = {amount: 0, symbol: ""}
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [stocks, setStocks] = useState<Stock[]>([emptyStock]);
    const [from, setFrom] = useState<Date>(new Date());
    const [to, setTo] = useState<Date>(new Date(Date.now()));

    const removeStock = (index: number) => {
        if (stocks.length > 1) {
            (setStocks(stocks.filter((value, pos) => pos !== index)));
        }
    }

    const checkDuplicateStock = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const found = stocks.find(stock => stock.symbol === event.target.value)
        if (found && found.symbol !== '') {
            dispatch(addError({error: `Stock ${found.symbol} already entered`}));
            event.target.value = '';
            return;
        }
        updateStock(event, index);
    }

    const updateStock = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newStock = Object.assign({}, stocks[index], {[event.target.name]: event.target.value});
        const stocksCopy = [...stocks];
        stocksCopy[index] = newStock;
        setStocks(stocksCopy);
    }

    const addNewRow = (value: Stock, index: number) => {
        return (
            <li key={`stock-${index}`}>
                <div className={`stock-item ${index}`}>
                    <input placeholder="Ticker name" name="symbol" value={stocks[index].symbol}
                           onChange={(e) => checkDuplicateStock(e, index)}/>
                    <input type="number" step="1" min="0" max="100" name="amount"
                           value={stocks[index].amount}
                           placeholder="Amount" onChange={e => updateStock(e, index)}/>
                    <div className="stock-actions">
                        <PlusCircle onClick={() => setStocks(prevState => [...prevState, emptyStock])}/>
                        <MinusCircle onClick={() => removeStock(index)}/>
                    </div>
                </div>
            </li>
        )
    }

    //TODO: Validate inputs and inform user
    const sendForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (from > to) {
            alert("From date cannot be later than to date");
            return;
        }
        const stockPayload: StockPayload = {
            from: from, stocks: stocks, to: to
        }
        navigate('/summary', { state: {
                stockPayload: stockPayload,
            } });
    }

    return (
        <React.Fragment>
            <ErrorDisplay/>
            <h1>Welcome to the dashboard</h1>
            <form onSubmit={event => sendForm(event)}>
                <div>
                    <label>From: </label>
                    <input type="date" pattern="yyyy-mm-dd" onChange={event => setFrom(new Date(event.target.value))}/>
                </div>
                <div>
                    <label>To: </label>
                    <input type="date" pattern="yyyy-mm-dd" onChange={event => setTo(new Date(event.target.value))}/>
                </div>
                <ul>
                    {
                        stocks.map((value, index) => {
                            return addNewRow(value, index);
                        })
                    }
                </ul>
                <button>Submit</button>
            </form>
        </React.Fragment>
    );
};

export default Dashboard;