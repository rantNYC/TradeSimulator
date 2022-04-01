import React, {useEffect, useState} from "react";
import "./Dashboard.scss"
import ErrorDisplay from "../component/ErrorDisplay";
import {InputMode} from "../type/PageTypes";
import DashboardManual from "./DashboardManual";
import DashboardAutomatic from "./DashboardAutomatic";
import {clearErrors, errorSelector} from "../store/ErrorReducer";
import {useAppDispatch, useAppSelector} from "../store/StoreHooks";

const Dashboard = () => {

    const errors = useAppSelector(errorSelector);
    const dispatch = useAppDispatch();
    const [inputMode, setInputMode] = useState(InputMode.None);

    useEffect(() => {
        // const timeout = setTimeout(() => {
        //     if (errors.length > 0){
        //         dispatch(clearErrors())
        //     }
        // }, 3000);

        // return () => clearTimeout(timeout);
    }, [errors.length, dispatch]);

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
            <ErrorDisplay removeMessage={removeMessage}/>
            <h1>Welcome to the dashboard</h1>
            <h2>Please select input method</h2>
            <button onClick={() => toggleMode(InputMode.Manual)}>Manual</button>
            <button onClick={() => toggleMode(InputMode.Automatic)}>Automatic</button>
            {inputMode === InputMode.Manual && <DashboardManual/>}
            {inputMode === InputMode.Automatic && <DashboardAutomatic/>}
        </React.Fragment>
    );
};

export default Dashboard;