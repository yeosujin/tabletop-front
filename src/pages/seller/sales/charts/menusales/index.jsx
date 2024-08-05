import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MenuSales = () => {
    const data = {
        labels: ['메뉴1', '메뉴2', '메뉴3', '메뉴4', '메뉴5'],
        datasets: [
            {
                label: '판매량',
                data: [12, 19, 3, 5, 2], // 예시 데이터
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
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
                text: '메뉴별 판매량',
            },
        },
    };

    return <Bar options={options} data={data} />;
};

export default MenuSales;