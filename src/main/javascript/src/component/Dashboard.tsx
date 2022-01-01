import React, {useState} from "react";
import "./Dashboard.scss"
import {Stock, StockPayload} from "../type/StockTypes";
import {PlusCircle} from "react-feather";
import { Navigate } from "react-router-dom";


const Dashboard = () => {

        const emptyStock: Stock = {amount: 0, symbol: ""}

        const [stocks, setStocks] = useState<Stock[]>([emptyStock]);
        const [from, setFrom] = useState<Date>(new Date());
        const [to, setTo] = useState<Date>(new Date(Date.now()));
        const [payload, setPayload] = useState<StockPayload>();

        const addStock = (stock: Stock) => {
            //TODO: No repeating stocks
            setStocks(() => [
                ...stocks,
                stock
            ]);
        };

        const updateStock = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
            const stock = stocks[index];
            stocks[index] = Object.assign({}, stock, {[event.target.name]: event.target.value});
        }

        const addNewRow = (index: number) => {
            return (
                <li key={index}>
                    <div className="stock-item">
                        <input placeholder="Ticker name" name="symbol"
                               onChange={event => updateStock(event, index)}/>
                        <input type="number" step="1" min="0" max="100" name="amount" placeholder="Amount of shares"
                               onChange={event => updateStock(event, index)}/>
                        <div className="stock-add">
                            <PlusCircle onClick={() => addStock(emptyStock)}/>
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
            console.log("Successfully created:", stockPayload);
            setPayload(stockPayload)
        }

        return (
            <React.Fragment>
                <h1>Welcome to the dashboard</h1>
                { payload &&
                    <Navigate to={"/summary"} state={payload} /> }
                <form onSubmit={event =>  sendForm(event)}>
                    <div>
                        <label>From: </label>
                        <input type="date" pattern="yyyy-mm-dd" onChange={event => setFrom(new Date(event.target.value))}/>
                    </div>
                    <div>
                        <label>To: </label>
                        <input type="date" pattern="yyyy-mm-dd" onChange={event => setTo(new Date(event.target.value))}/>
                    </div>
                    <ul>
                        {stocks.map((value, index) => {
                            return (
                                addNewRow(index)
                            )
                        })}
                    </ul>
                    <button>Submit</button>
                </form>
            </React.Fragment>
        );
    }
;

export default Dashboard;