import axios from 'axios';

const BASE_URL = '/api/sales';

export const SalesAPI = {
    getDailyComparison: async (storeId) => {
        try {
            const response = await axios.get(`${BASE_URL}/${storeId}/daily-comparison`);
            return response.data;
        } catch (error) {
            console.error('Error fetching daily comparison:', error);
            throw error;
        }
    },

    getMenuSales: async (storeId) => {
        try {
            const response = await axios.get(`${BASE_URL}/${storeId}/menu-sales`);
            return response.data;
        } catch (error) {
            console.error('Error fetching menu sales:', error);
            throw error;
        }
    },

    getMonthlySales: async (storeId) => {
        try {
            const response = await axios.get(`${BASE_URL}/${storeId}/monthly`);
            return response.data;
        } catch (error) {
            console.error('Error fetching monthly sales:', error);
            throw error;
        }
    },

    getWeeklySales: async (storeId) => {
        try {
            const response = await axios.get(`${BASE_URL}/${storeId}/weekly`);
            return response.data;
        } catch (error) {
            console.error('Error fetching weekly sales:', error);
            throw error;
        }
    },

    getWeeklyDailySales: async (storeId) => {
        try {
            const response = await axios.get(`${BASE_URL}/${storeId}/weekly-daily`);
            return response.data;
        } catch (error) {
            console.error('Error fetching weekly daily sales:', error);
            throw error;
        }
    },
};