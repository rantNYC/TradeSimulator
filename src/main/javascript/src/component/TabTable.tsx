import React from "react";
import {StockData} from "../feature/Summary";
import {TabProps} from "../type/PageTypes";

export interface TabTableProps extends TabProps{
    stockData: StockData,
}

const TabTable: React.FC<TabTableProps> = ({name, label, stockData}) => {
    return (
        <div className={`tab-${name}`}>
            <h2>{label}</h2>
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
                    stockData.data.map((value, index) => {
                        if(value == null) return null;
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

    )
}

export default TabTable;