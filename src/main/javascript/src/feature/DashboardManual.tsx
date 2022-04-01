import {ChangeEvent, FormEvent, useState} from "react";
import {Stock, StockPayload} from "../type/StockTypes";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../store/StoreHooks";
import {addError} from "../store/ErrorReducer";
import {MinusCircle, PlusCircle} from "react-feather";
import {addStockEmpty, removePosStock, stockSelector, updateStock} from "../store/StocksReducer";

const DashboardManual = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const stocks = useAppSelector(stockSelector);
    const [from, setFrom] = useState<Date>(new Date());
    const [to, setTo] = useState<Date>(new Date(Date.now()));

    const checkDuplicateStock = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const found = stocks.find(stock => stock.symbol === e.target.value)
        if (found && found.symbol !== '') {
            dispatch(addError({error: `Stock ${found.symbol} already entered`}));
            e.target.value = '';
            return;
        }
        modifyStock(e, index);
    }

    const modifyStock = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const newStock = Object.assign({}, stocks[index], {[e.target.name]: e.target.value});
        dispatch(updateStock({pos: index, data: newStock}));
    }

    const addNewRow = (value: Stock, index: number) => {
        return (
            <li key={`stock-${index}`}>
                <div className={`stock-item ${index}`}>
                    <input placeholder="Ticker name" name="symbol" value={stocks[index].symbol}
                           onChange={(e) => checkDuplicateStock(e, index)}/>
                    <input type="number" step="1" min="0" max="100" name="amount"
                           value={stocks[index].amount}
                           placeholder="Amount" onChange={e => modifyStock(e, index)}/>
                    <div className="stock-actions">
                        <PlusCircle onClick={() => dispatch(addStockEmpty())}/>
                        <MinusCircle onClick={() => dispatch(removePosStock(index))}/>
                    </div>
                </div>
            </li>
        )
    }

    //TODO: Validate inputs and inform user
    const sendForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (from > to) {
            alert("From date cannot be later than to date");
            return;
        }
        const stockPayload: StockPayload = {
            from: from, stocks: stocks, to: to
        }
        navigate('/summary', {
            state: stockPayload,
        });
    }
    return (
        <>
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
        </>
    )
}

export default DashboardManual;