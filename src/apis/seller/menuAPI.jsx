import axios from "axios";

const getTokenHeaders = () => {
    const TOKEN_TYPE = localStorage.getItem("tokenType");
    const ACCESS_TOKEN = localStorage.getItem("accessToken");
    let REFRESH_TOKEN = localStorage.getItem("refreshToken");

    return {
        'Authorization': `${TOKEN_TYPE} ${ACCESS_TOKEN}`,
        'REFRESH_TOKEN': REFRESH_TOKEN
    };
};

export const MenuApi = axios.create({
    baseURL: `http://localhost:8080`,
});

const refreshAccessToken = async () => {
    try {
        const response = await MenuApi.post(`/api/auth/token/refresh`, null, {
            headers: getTokenHeaders()
        });
        const ACCESS_TOKEN = response.data;
        localStorage.setItem('accessToken', ACCESS_TOKEN);
    } catch (err) {
        if (err.response && err.response.status === 401) {
            alert(err.response.data.message);
            localStorage.clear();
            window.location.href = '/signin';
        }
    }
};

MenuApi.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        await refreshAccessToken();
        originalRequest.headers['Authorization'] = `${localStorage.getItem("tokenType")} ${localStorage.getItem('accessToken')}`;
        return MenuApi(originalRequest);
    }

    return Promise.reject(error);
});


// 메뉴 등록
export const createMenu = async (storeId, menuData) => {
    try {
        const response = await MenuApi.post(`/api/stores/${storeId}/menus`, menuData, {
            headers: {
                ...getTokenHeaders()
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating menu:', error);
        throw error;
    }
};

// 메뉴 수정
export const updateMenu = async (storeId, menuId, menuData) => {
    try {
        const response = await MenuApi.put(`/api/stores/${storeId}/menus/${menuId}`, menuData, {
            headers: {
                ...getTokenHeaders(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating menu:', error);
        throw error;
    }
};

// 메뉴 조회
export const getMenus = async (storeId, lastMenuId, limit) => {
    try {
        const response = await MenuApi.get(`/api/stores/${storeId}/menus`, {
            params: { lastMenuId, limit },
            headers: getTokenHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching menus:', error);
        throw error;
    }
};

// 메뉴 삭제
export const deleteMenu = async (storeId, menuId) => {
    try {
        const response = await MenuApi.delete(`/api/stores/${storeId}/menus/${menuId}`, {
            headers: getTokenHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting menu:', error);
        throw error;
    }
};