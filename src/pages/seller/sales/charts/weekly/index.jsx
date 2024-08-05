import React from 'react';
import { Bar } from 'react-chartjs-2';

const WeeklySales = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.week),
        datasets: [
            {
                label: '주별 매출',
                data: data.map(item => item.totalSales),
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
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
                text: '주별 매출',
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default WeeklySales;