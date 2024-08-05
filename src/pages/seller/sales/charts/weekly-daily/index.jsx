import React from 'react';
import { Line } from 'react-chartjs-2';

const WeeklyDailySales = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.day),
        datasets: [
            {
                label: '일별 매출',
                data: data.map(item => item.totalSales),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '주간 일별 매출',
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default WeeklyDailySales;