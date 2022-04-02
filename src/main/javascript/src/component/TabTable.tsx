import React from "react";
import {StockData} from "../feature/Summary";
import {TabProps} from "../type/PageTypes";
import SummaryChart from "../feature/SummaryChart";
import './TabTable.scss'

export interface TabTableProps extends TabProps {
    stockData: StockData,
}

const TabTable: React.FC<TabTableProps> = ({name, label, stockData}) => {
    return (
        <div className={`tab-${name}`}>
            <h2>{label}</h2>
            <SummaryChart data={stockData}/>
            <table className="table-data">
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
                        if (value == null) return null;
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