import axios from 'axios';

const getTokenHeaders = () => {
    const TOKEN_TYPE = localStorage.getItem("tokenType");
    const ACCESS_TOKEN = localStorage.getItem("accessToken");
    let REFRESH_TOKEN = localStorage.getItem("refreshToken");

    return {
        'Authorization': `${TOKEN_TYPE} ${ACCESS_TOKEN}`,
        'REFRESH_TOKEN': REFRESH_TOKEN
    };
};

const BASE_URL = 'http://localhost:8080/api/sales';

export const SalesAPI = {
    getDailyComparison: async (storeId) => {
        try {
            const response = await axios.get(`${BASE_URL}/${storeId}/daily-comparison`, {
                headers: getTokenHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching daily comparison:', error);
            throw error;
        }
    },

    getMenuSales: async (storeId) => {
        try {
            const response = await axios.get(`${BASE_URL}/${storeId}/menu-sales`, {
                headers: getTokenHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching menu sales:', error);
            throw error;
        }
    },

    getMonthlySales: async (storeId) => {
        try {
            const response = await axios.get(`${BASE_URL}/${storeId}/monthly`, {
                headers: getTokenHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching monthly sales:', error);
            throw error;
        }
    },

    getWeeklySales: async (storeId) => {
        try {
            const response = await axios.get(`${BASE_URL}/${storeId}/weekly`, {
                headers: getTokenHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching weekly sales:', error);
            throw error;
        }
    },

    getWeeklyDailySales: async (storeId) => {
        try {
            const response = await axios.get(`${BASE_URL}/${storeId}/weekly-daily`, {
                headers: getTokenHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching weekly daily sales:', error);
            throw error;
        }
    },
};