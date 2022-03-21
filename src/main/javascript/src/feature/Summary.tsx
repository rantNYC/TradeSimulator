import {StockInfo, StockPayload} from "../type/StockTypes";
import React, {useCallback, useEffect, useState} from "react";
import {Navigate, useLocation} from "react-router-dom";
import {ErrorMessage, PageStatus} from "../type/PageTypes";
import {Loader} from "react-feather";
import Router from "../util/Router";
import axios, {AxiosError} from "axios";
import Tabs from "../component/Tabs";
import {TabTableProps} from "../component/TabTable";
import {useAppDispatch} from "../store/StoreHooks";
import {addError} from "../store/ErrorReducer";
import SummaryChart from "./SummaryChart";

export interface StockData {
    data: StockInfo[],
    ticker: string,
}

const Summary = () => {

    const dispatch = useAppDispatch();

    const payload = useLocation().state as StockPayload;
    const [status, setStatus] = useState<PageStatus>(PageStatus.Idle);
    const [data, setData] = useState<StockData[]>([])

    const getData = useCallback(async (): Promise<StockData[] | ErrorMessage> => {
        try {
            const res = await axios.post<StockData[]>(
                Router.STOCK,
                payload,
            );
            return await res.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const serverError = err as AxiosError<any>;
                if (serverError && serverError.response) {
                    return { error: `${serverError.response.data.message }` };
                }
            }
            return {error: "Something went wrong!"};
        }
    }, [payload]);


    useEffect(() => {
        (async () => {
            if (payload !== null && status === PageStatus.Idle) {
                setStatus(PageStatus.Pending);
                const res = await getData();
                if (Array.isArray(res)) {
                    console.log("Results:", res);
                    setData(res);
                    setStatus(PageStatus.Done);
                } else {
                    dispatch(addError(res))
                    setStatus(PageStatus.Error);
                }
            }
        })();
        return () => { // Runs when component will unmount
            setData([]);
            setStatus(() => PageStatus.Idle);
        };
    }, [getData, payload, dispatch]);

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
            {payload === undefined && <Navigate to={"/dashboard"}/>}
            {(status === PageStatus.Idle || status === PageStatus.Pending) && <Loader/>}
            {(status === PageStatus.Error) && <Navigate to={"/dashboard"} />}
            {status === PageStatus.Done &&
                <div>
                    <Tabs
                        displayName='Stocks Summary'
                        tabList={createTabStockData(data)}/>
                    <SummaryChart data={data}/>
                </div>
            }
        </div>
    )
}

export default Summary;