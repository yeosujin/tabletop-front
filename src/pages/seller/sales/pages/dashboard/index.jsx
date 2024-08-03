import React, { useState } from 'react';
import DailyComparison from '../../charts/dailycomparison';
import MenuSales from '../../charts/menusales';
import Monthly from '../../charts/monthly';
import Weekly from '../../charts/weekly';
import WeeklyDaily from '../../charts/weekly-daily';

const Dashboard = () => {
    const [activeChart, setActiveChart] = useState('dailyComparison');

    const renderChart = () => {
        switch (activeChart) {
            case 'dailyComparison':
                return <DailyComparison />;
            case 'menuSales':
                return <MenuSales />;
            case 'monthly':
                return <Monthly />;
            case 'weekly':
                return <Weekly />;
            case 'weeklyDaily':
                return <WeeklyDaily />;
            default:
                return null;
        }
    };

    return (
        <div>
            <nav>
                <button onClick={() => setActiveChart('dailyComparison')}>일일 비교</button>
                <button onClick={() => setActiveChart('menuSales')}>메뉴 판매량</button>
                <button onClick={() => setActiveChart('monthly')}>월별 매출</button>
                <button onClick={() => setActiveChart('weekly')}>주별 매출</button>
                <button onClick={() => setActiveChart('weeklyDaily')}>주간 일별 매출</button>
            </nav>
            <div className="chart-container">
                {renderChart()}
            </div>
        </div>
    );
};

export default Dashboard;