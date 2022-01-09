import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Dashboard from "./feature/Dashboard";
import Summary from "./feature/Summary";
import {Provider} from "react-redux";
import {store} from "./store/Store";

const App = () => {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <Routes>
                    <Route path="/" element={<Dashboard/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/summary" element={<Summary/>}/>
                </Routes>
            </Provider>
        </BrowserRouter>
    );
}

export default App;
