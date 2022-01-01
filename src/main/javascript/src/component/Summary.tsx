import {StockInfo, StockPayload} from "../type/StockTypes";
import React, {useEffect, useState} from "react";
import {Navigate, useLocation} from "react-router-dom";
import {PageStatus, ServerError} from "../type/PageTypes";
import {Loader} from "react-feather";
import Router from "../util/Router";
import axios, {AxiosError} from "axios";

export interface StockData {
    data: StockInfo[]
}

const Summary = () => {

    const location = useLocation();
    const payload = location.state as StockPayload;

    const [status, setStatus] = useState<PageStatus>(PageStatus.Idle);
    const [data, setData] = useState<StockData>({data: []})
    useEffect(() => {
        (async () => {
            if (payload !== null && status === PageStatus.Idle) {
                setStatus(PageStatus.Pending);
                const res = await getData();
                if (res as StockData) {
                    setStatus(PageStatus.Done);
                    setData(res as StockData);
                } else {
                    setStatus(PageStatus.Error);
                }
            }
        })();
        return () => { // Runs when component will unmount
        };
    }, [data, status]);

    const getData = async (): Promise<StockData | ServerError> => {
        try {
            const res = await axios.post<StockData>(
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

    return (
        <div>
            {payload === null && <Navigate to={"/dashboard"}/>}
            {(status === PageStatus.Idle || status === PageStatus.Pending) && <Loader/>}
            {(status === PageStatus.Error) && <Navigate to={"/dashboard"}/>}
            {status === PageStatus.Done &&
                <div>
                    <h1>Stock Summary</h1>
                    <table>
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Ticker</th>
                            <th>Open</th>
                            <th>Close</th>
                            <th>Dividend</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            data.data.map((value, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{value.date}</td>
                                        <td>{value.symbol}</td>
                                        <td>{value.open}</td>
                                        <td>{value.close}</td>
                                        <td>{value.dividend}</td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}

export default Summary;