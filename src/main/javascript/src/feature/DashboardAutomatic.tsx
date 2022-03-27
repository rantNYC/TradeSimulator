import {ChangeEvent, useState} from "react";
import axios from "axios";
import {csvParserRoute} from "../util/Router";
import {useAppDispatch} from "../store/StoreHooks";
import {addError} from "../store/ErrorReducer";
import {addStocks} from "../store/StocksReducer";
import {Stock} from "../type/StockTypes";
import {PageStatus} from "../type/PageTypes";
import {Loader} from "react-feather";
import DashboardManual from "./DashboardManual";

const DashboardAutomatic = () => {

    const dispatch = useAppDispatch();
    const [status, setStatus] = useState<PageStatus>(PageStatus.Idle);

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files === null) {
            return;
        }
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        setStatus(PageStatus.Pending);
        axios.post<Stock[]>(
            csvParserRoute,
            formData,
            {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
        ).then(res => {
            dispatch(addStocks(res.data));
            setStatus(PageStatus.Done);
        }).catch(err => {
            dispatch(addError({error: err.message}));
            setStatus(PageStatus.Error);
        })
    }

    return (
        <>
            <h4>Enter csv file with stock info</h4>
            <div>
                <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                />
                {status === PageStatus.Pending && <Loader/>}
                {status === PageStatus.Done && <DashboardManual/>}
            </div>
        </>
    )
}

export default DashboardAutomatic;