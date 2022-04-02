import {ChangeEvent, useState} from "react";
import axios from "axios";
import {csvParserRoute} from "../util/Router";
import {useAppDispatch} from "../store/StoreHooks";
import {addError} from "../store/ErrorReducer";
import {addStocks} from "../store/StocksReducer";
import {Stock} from "../type/StockTypes";
import {PageStatus} from "../type/PageTypes";
import {Loader, Upload} from "react-feather";
import DashboardManual from "./DashboardManual";
import './DashboardAutomatic.scss';

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
            <div>
                <div className="automatic-upload">
                    <label htmlFor="file-upload" className="custom-file-upload">
                        <Upload/>
                        <div className="automatic-label">
                            Csv file with stock info
                        </div>
                    </label>
                    <input id="file-upload" type="file" onChange={handleFileUpload}/>
                </div>
                {status === PageStatus.Pending && <Loader/>}
                {status === PageStatus.Done && <DashboardManual/>}
            </div>
        </>
    )
}

export default DashboardAutomatic;