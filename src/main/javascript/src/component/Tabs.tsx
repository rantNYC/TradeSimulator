import React, {useState} from "react";
import TabTable, {TabTableProps} from "./TabTable";

interface TabsProps{
    displayName: string,
    tabList: TabTableProps[],
}

const Tabs : React.FC<TabsProps> = ({displayName, tabList}) => {
    const [currentTab, setCurrentTab] = useState(0);
    return(
        <div>
            <h1>{displayName}</h1>
            <div className="tabs">
                {
                    tabList.map((value, index) => (
                        <button
                            key={index}
                            className={(index === currentTab) ? 'tab-active' : ''}
                            onClick={() => setCurrentTab(index)}>
                            {value.label}
                        </button>
                    ))
                }
            </div>
            {
                <TabTable
                    name={tabList[currentTab].name}
                    label={tabList[currentTab].label}
                    stockData={tabList[currentTab].stockData}
                />
            }
        </div>
    )
}

export default Tabs;