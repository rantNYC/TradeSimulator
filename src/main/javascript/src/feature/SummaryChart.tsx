import {StockData} from "./Summary";
import {LineChart, CartesianGrid, Line, Tooltip, XAxis, YAxis, ResponsiveContainer} from "recharts";

interface SummaryChartProps {
    data: StockData[],
}

interface SummaryData extends Record<string, any> {
    date: Date,
    error?: boolean
}

const SummaryChart: React.FC<SummaryChartProps> = ({data}) => {

    const combineData = (dataPoints: StockData[]) : SummaryData[] => {
        const res: SummaryData[] = [];
        dataPoints.map(value => {
            const name = value.ticker;
            value.data.map((val, index) => {
                if (!val) {
                    if (res[index] === undefined) {
                        res.push({
                            date: Date.prototype,
                            error: true,
                            [name]: name,
                        })
                    }
                } else if (res[index] !== undefined) {
                    res[index][name] = val.close;
                } else {
                    res.push({
                        date: val.date,
                        [name]: val.close
                    })
                }
            });
        });

        return res.filter(value => !value.error).sort((a,b) => a.date > b.data ? 1 : -1);
    }

    const finalData = combineData(data);
    return (
        <>
            <ResponsiveContainer width={"80%"} height={"50%"} aspect={2}>
                <LineChart data={finalData}>
                    <CartesianGrid stroke="#ccc" strokeDasharray="3 3"/>
                    <XAxis dataKey="date"/>
                    <YAxis/>
                    <Tooltip/>
                    {data.map((value) => {
                        return (
                            <Line type="monotone" dataKey={value.ticker} stroke="#8884d8"/>
                        );
                    })}
                </LineChart>
            </ResponsiveContainer>
        </>
    )
}

export default SummaryChart;