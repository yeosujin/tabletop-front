import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DailyComparison = ({data}) => {
    const chartData = {
        labels: ['어제', '오늘'],
        datasets: [
            {
                label: '일일 매출 비교',
                data: [data.yesterday, data.today],
                backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(53, 162, 235, 0.5)'],
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
                text: '일일 매출 비교',
            },
        },
    };

    return  <Bar data={chartData} options={options} />;
};

export default DailyComparison;