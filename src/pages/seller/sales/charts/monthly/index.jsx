import React from 'react';
import { Line } from 'react-chartjs-2';

const MonthlySales = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.month),
        datasets: [
            {
                label: '월별 매출',
                data: data.map(item => item.totalSales),
                borderColor: 'rgb(75, 192, 192)',
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
                text: '월별 매출 추이',
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default MonthlySales;