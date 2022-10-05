import React from 'react';
import {Route, Routes, useNavigate} from "react-router-dom";
import Dashboard from "./feature/Dashboard";
import Summary from "./feature/Summary";
import {Provider} from "react-redux";
import {store} from "./store/Store";
import './App.scss';
import {ArrowLeft} from "react-feather";


const App = () => {
    const navigate = useNavigate();

    return (
        <Provider store={store}>
            <header className="fixed-header">
                <h1 className="fixed-header-h1">Trade Stock Simulator</h1>
                <ArrowLeft className="fixed-header-left" onClick={() => navigate(-1)} />
            </header>
            <div>
                <Routes>
                    <Route path="/" element={<Dashboard/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/summary" element={<Summary/>}/>
                </Routes>
            </div>
        </Provider>
    );
}

export default App;
