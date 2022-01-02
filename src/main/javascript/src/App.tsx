import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Dashboard from "./component/Dashboard";
import Summary from "./component/Summary";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/summary" element={<Summary/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
