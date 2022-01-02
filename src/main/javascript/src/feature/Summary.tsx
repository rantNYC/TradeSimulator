import {StockInfo, StockPayload} from "../type/StockTypes";
import React, {useEffect, useState} from "react";
import {Navigate, useLocation} from "react-router-dom";
import {PageStatus, ServerError} from "../type/PageTypes";
import {Loader} from "react-feather";
import Router from "../util/Router";
import axios, {AxiosError} from "axios";
import Tabs from "../component/Tabs";
import {TabTableProps} from "../component/TabTable";

export interface StockData {
    data: StockInfo[],
    ticker: string,
}

const Summary = () => {

    const location = useLocation();
    const payload = location.state as StockPayload;

    const [status, setStatus] = useState<PageStatus>(PageStatus.Idle);
    const [data, setData] = useState<StockData[]>([])
    useEffect(() => {
        (async () => {
            if (payload !== null && status === PageStatus.Idle) {
                setStatus(PageStatus.Pending);
                const res = await getData();
                if (Array.isArray(res)) {
                    setData(res);
                    setStatus(PageStatus.Done);
                } else {
                    setStatus(PageStatus.Error);
                }
            }
        })();
        return () => { // Runs when component will unmount
        };
    }, [data, status]);

    const getData = async (): Promise<StockData[] | ServerError> => {
        try {
            const res = await axios.post<StockData[]>(
                Router.stock(),
                payload,
            );
            return await res.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const serverError = err as AxiosError<ServerError>;
                if (serverError && serverError.response) {
                    return serverError.response.data;
                }
            }
            return {error: "Something went wrong!"};
        }
    };

    const createTabStockData = (stocks: StockData[]) => {
        let tabStockData: TabTableProps[] = [];
        stocks.forEach((value) => {
            //TODO: Use security name instead of ticker
            tabStockData.push({label: value.ticker, name: value.ticker, stockData: value})
        })

        return tabStockData
    }

    return (
        <div>
            {payload === null && <Navigate to={"/dashboard"}/>}
            {(status === PageStatus.Idle || status === PageStatus.Pending) && <Loader/>}
            {(status === PageStatus.Error) && <Navigate to={"/dashboard"}/>}
            {status === PageStatus.Done &&
                <div>
                    <Tabs
                        displayName='Stocks Summary'
                        tabList={createTabStockData(data)}/>
                </div>
            }
        </div>
    )
}

export default Summary;