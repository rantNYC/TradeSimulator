import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Dashboard from "./feature/Dashboard";
import Summary from "./feature/Summary";
import {Provider} from "react-redux";
import {store} from "./store/Store";
import './App.scss';

const App = () => {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <header className="fixed-header">
                    <h1>Trade Stock Simulator</h1>
                </header>
                <div>
                    <Routes>
                        <Route path="/" element={<Dashboard/>}/>
                        <Route path="/dashboard" element={<Dashboard/>}/>
                        <Route path="/summary" element={<Summary/>}/>
                    </Routes>
                </div>
            </Provider>
        </BrowserRouter>
    );
}

export default App;
