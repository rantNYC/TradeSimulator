import {StockData} from "./Summary";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {FC} from "react";

interface SummaryChartProps {
    data: StockData,
}

const SummaryChart: FC<SummaryChartProps> = ({data}) => {

    return (
        <>
            <ResponsiveContainer width={"80%"} height={"50%"} aspect={2}>
                <LineChart data={data.data}>
                    <CartesianGrid stroke="#ccc" strokeDasharray="3 3"/>
                    <XAxis dataKey="date"/>
                    <YAxis/>
                    <Tooltip/>
                    <Line type="monotone" dataKey={"close"} stroke="#8884d8"/>
                </LineChart>
            </ResponsiveContainer>
        </>
    )
}

export default SummaryChart;