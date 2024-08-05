import React, { useState, useEffect } from 'react';
import { SalesAPI } from '../../../../../apis/seller/SalesAPI';
import DailyComparison from '../../charts/dailycomparison';
import MenuSales from '../../charts/menusales';
import MonthlySales from '../../charts/monthly';
import WeeklySales from '../../charts/weekly';
import WeeklyDailySales from '../../charts/weekly-daily';

const Dashboard = ({ storeId }) => {
    const [activeChart, setActiveChart] = useState('dailyComparison');
    const [dailyComparisonData, setDailyComparisonData] = useState(null);
    const [menuSalesData, setMenuSalesData] = useState(null);
    const [monthlySalesData, setMonthlySalesData] = useState(null);
    const [weeklySalesData, setWeeklySalesData] = useState(null);
    const [weeklyDailySalesData, setWeeklyDailySalesData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dailyComparison = await SalesAPI.getDailyComparison(storeId);
                setDailyComparisonData(dailyComparison);

                const menuSales = await SalesAPI.getMenuSales(storeId);
                setMenuSalesData(menuSales);

                const monthlySales = await SalesAPI.getMonthlySales(storeId);
                setMonthlySalesData(monthlySales);

                const weeklySales = await SalesAPI.getWeeklySales(storeId);
                setWeeklySalesData(weeklySales);

                const weeklyDailySales = await SalesAPI.getWeeklyDailySales(storeId);
                setWeeklyDailySalesData(weeklyDailySales);
            } catch (error) {
                console.error('Error fetching sales data:', error);
            }
        };

        fetchData();
    }, [storeId]);

    const renderChart = () => {
        switch (activeChart) {
            case 'dailyComparison':
                return dailyComparisonData && <DailyComparison data={dailyComparisonData} />;
            case 'menuSales':
                return menuSalesData && <MenuSales data={menuSalesData} />;
            case 'monthlySales':
                return monthlySalesData && <MonthlySales data={monthlySalesData} />;
            case 'weeklySales':
                return weeklySalesData && <WeeklySales data={weeklySalesData} />;
            case 'weeklyDailySales':
                return weeklyDailySalesData && <WeeklyDailySales data={weeklyDailySalesData} />;
            default:
                return null;
        }
    };

    return (
        <div>
            <h1>Sales Dashboard</h1>
            <div>
                <button onClick={() => setActiveChart('dailyComparison')}>일일 비교</button>
                <button onClick={() => setActiveChart('menuSales')}>메뉴별 판매량</button>
                <button onClick={() => setActiveChart('monthlySales')}>월별 매출</button>
                <button onClick={() => setActiveChart('weeklySales')}>주별 매출</button>
                <button onClick={() => setActiveChart('weeklyDailySales')}>주간 일별 매출</button>
            </div>
            <div className="chart-container">
                {renderChart()}
            </div>
        </div>
    );
};

export default Dashboard;