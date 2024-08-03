import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Weekly = () => {
    const data = {
        labels: ['1주차', '2주차', '3주차', '4주차'],
        datasets: [
            {
                label: '주별 매출',
                data: [15000, 20000, 18000, 22000], // 예시 데이터
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

    return <Bar options={options} data={data} />;
};

export default Weekly;