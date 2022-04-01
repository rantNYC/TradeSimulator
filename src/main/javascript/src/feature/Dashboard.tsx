import React, {useState} from "react";
import "./Dashboard.scss"
import ErrorDisplay from "../component/ErrorDisplay";
import {InputMode} from "../type/PageTypes";
import DashboardManual from "./DashboardManual";
import DashboardAutomatic from "./DashboardAutomatic";
import {clearErrors} from "../store/ErrorReducer";
import {useAppDispatch} from "../store/StoreHooks";

const Dashboard = () => {

    const dispatch = useAppDispatch();
    const [inputMode, setInputMode] = useState(InputMode.None);

    // useEffect(() => {
    // const timeout = setTimeout(() => {
    //     if (errors.length > 0){
    //         dispatch(clearErrors())
    //     }
    // }, 3000);

    // return () => clearTimeout(timeout);
    // }, [errors.length, dispatch]);

    const removeMessage = () => {
        dispatch(clearErrors());
    }

    const toggleMode = (mode: InputMode) => {
        if (mode === inputMode) {
            setInputMode(InputMode.None);
        } else {
            setInputMode(mode);
        }
    }

    return (
        <React.Fragment>
            <div className="content">
                <div className="input-header">
                    <h2>Input method</h2>
                </div>
                <div className="grid">
                    <button onClick={() => toggleMode(InputMode.Manual)}>Manual</button>
                    <button onClick={() => toggleMode(InputMode.Automatic)}>Automatic</button>
                </div>
                <div className="input-content">
                    {inputMode === InputMode.Manual && <DashboardManual/>}
                    {inputMode === InputMode.Automatic && <DashboardAutomatic/>}
                </div>
            </div>
            <ErrorDisplay removeMessage={removeMessage}/>
        </React.Fragment>
    );
};

export default Dashboard;