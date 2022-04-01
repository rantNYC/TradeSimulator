import {StockInfo, StockPayload} from "../type/StockTypes";
import {useCallback, useEffect, useState} from "react";
import {Navigate, useLocation} from "react-router-dom";
import {ErrorMessage, PageStatus} from "../type/PageTypes";
import {Loader} from "react-feather";
import {stockRoute} from "../util/Router";
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

    const getData = useCallback(async () => {
        axios.post<StockData[]>(
            stockRoute,
            payload,
        ).then(res => {
            setData(res.data);
            setStatus(PageStatus.Done);
        }).catch(error => {
            let errProp: ErrorMessage;
            if (axios.isAxiosError(error)) {
                const serverError = error as AxiosError<any>;
                if (serverError && serverError.response) {
                    errProp = {error: `${serverError.response.data.message}`};
                } else {
                    errProp = {error: "Something went wrong!"};
                }
            } else {
                errProp = {error: "Something went wrong!"};
            }
            dispatch(addError(errProp))
            setStatus(PageStatus.Error)
        });
    }, [dispatch, payload]);


    useEffect(() => {
        if (payload !== null && status === PageStatus.Idle) {
            setStatus(PageStatus.Pending);
            getData();
        }
    }, [getData, payload, status]);

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
            {(status === PageStatus.Error) && <Navigate to={"/dashboard"}/>}
            {status === PageStatus.Done &&
                <div>
                    <Tabs
                        displayName='Stocks Summary'
                        tabList={createTabStockData(data)}
                    />
                </div>
            }
        </div>
    )
}

export default Summary;