import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DailyComparison = () => {
    const data = {
        labels: ['어제', '오늘'],
        datasets: [
            {
                label: '매출',
                data: [12000, 15000], // 예시 데이터
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

    return <Bar options={options} data={data} />;
};

export default DailyComparison;