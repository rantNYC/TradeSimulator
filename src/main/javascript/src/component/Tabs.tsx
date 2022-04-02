import React, {useEffect, useState} from "react";
import TabTable, {TabTableProps} from "./TabTable";
import './Tabs.scss';

interface TabsProps {
    displayName: string,
    tabList: TabTableProps[],
}

const Tabs: React.FC<TabsProps> = ({displayName, tabList}) => {
    const [currentTab, setCurrentTab] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentTab])

    return (
        <>
            <h1>{displayName}</h1>
            <div className="tabs-vertical">
                <div className="tabs-buttons">
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
                <div className="tabs-content">
                    <TabTable
                        name={tabList[currentTab].name}
                        label={tabList[currentTab].label}
                        stockData={tabList[currentTab].stockData}
                    />
                </div>
            </div>
        </>
    )
}

export default Tabs;