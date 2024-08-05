import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { SalesAPI } from '../../../../../apis/seller/SalesAPI';
import DailyComparison from '../../charts/dailycomparison';
import MenuSales from '../../charts/menusales';
import MonthlySales from '../../charts/monthly';
import WeeklySales from '../../charts/weekly';
import WeeklyDailySales from '../../charts/weekly-daily';
import { Box, Card, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { BarChart, PieChart, Timeline, TrendingUp, DateRange } from '@mui/icons-material';

const Dashboard = () => {
    const { storeId } = useParams();
    const [activeChart, setActiveChart] = useState('dailyComparison');
    const [dailyComparisonData, setDailyComparisonData] = useState(null);
    const [menuSalesData, setMenuSalesData] = useState(null);
    const [monthlySalesData, setMonthlySalesData] = useState(null);
    const [weeklySalesData, setWeeklySalesData] = useState(null);
    const [weeklyDailySalesData, setWeeklyDailySalesData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!storeId) {
                console.error('StoreId is not available');
                return;
            }
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
        const id = localStorage.getItem('storeId');
        // setStoreId(id);
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
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {/*<h1>Sales Dashboard</h1>*/}
            <Box sx={{ width: 250, flexShrink: 0, mr: 3, mb: 2 }}>
                <Card>
                    <List>
                        {[
                            { label: '일일 비교', value: 'dailyComparison', icon: <BarChart /> },
                            { label: '메뉴별 판매량', value: 'menuSales', icon: <PieChart /> },
                            { label: '월별 매출', value: 'monthlySales', icon: <Timeline /> },
                            { label: '주별 매출', value: 'weeklySales', icon: <TrendingUp /> },
                            { label: '주간 일별 매출', value: 'weeklyDailySales', icon: <DateRange /> },
                        ].map(({ label, value, icon }) => (
                            <ListItem key={value} disablePadding>
                                <ListItemButton
                                    selected={activeChart === value}
                                    onClick={() => setActiveChart(value)}
                                    sx={{
                                        '&.Mui-selected': {
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            '&:hover': {
                                                bgcolor: 'primary.dark',
                                            },
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary={label}
                                        primaryTypographyProps={{
                                            sx: {
                                                fontSize: '1.15rem',
                                            },
                                        }}
                                    />
                                    {icon}
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Card>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
                <div style={{
                    width: '100%',
                    height: '400px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {renderChart()}
                </div>
            </Box>
        </Box>
    );
};

export default Dashboard;