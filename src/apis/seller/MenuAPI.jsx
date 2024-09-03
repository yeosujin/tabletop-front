import axios from 'axios'

const getTokenHeaders = () => {
    const TOKEN_TYPE = localStorage.getItem('tokenType')
    const ACCESS_TOKEN = localStorage.getItem('accessToken')
    let REFRESH_TOKEN = localStorage.getItem('refreshToken')

    return {
        Authorization: `${TOKEN_TYPE} ${ACCESS_TOKEN}`,
        REFRESH_TOKEN: REFRESH_TOKEN,
    }
}

export const MenuAPI = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
})

const refreshAccessToken = async () => {
    try {
        const response = await MenuAPI.post(`/api/auth/token/refresh`, null, {
            headers: getTokenHeaders(),
        })
        const ACCESS_TOKEN = response.data
        localStorage.setItem('accessToken', ACCESS_TOKEN)
    } catch (err) {
        if (err.response && err.response.status === 401) {
            alert(err.response.data.message)
            localStorage.clear()
            window.location.href = '/login'
        }
    }
}

MenuAPI.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config

        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true
            await refreshAccessToken()
            originalRequest.headers['Authorization'] =
                `${localStorage.getItem('tokenType')} ${localStorage.getItem('accessToken')}`
            return MenuAPI(originalRequest)
        }

        return Promise.reject(error)
    }
)

// 메뉴 목록 조회
export const getMenus = async (storeId, lastMenuId, limit) => {
    const response = await MenuAPI.get(`/api/stores/${storeId}/menus`, {
        params: { lastMenuId, limit },
        headers: getTokenHeaders(),
    })
    return response.data
}


/**
 * 특정 매장에 새로운 메뉴를 생성합니다.
 *
 * @param {string} storeId - 메뉴를 생성할 매장의 ID입니다.
 * @param {Object} menuData - 생성할 메뉴에 대한 데이터입니다. 메뉴에 필요한 세부 정보를 포함해야 합니다.
 * @param {string} menuData.name - 메뉴의 이름입니다.
 * @param {string} [menuData.description] - 메뉴에 대한 선택적 설명입니다.
 * @param {Array<Object>} menuData.items - 메뉴에 포함된 항목들의 배열입니다.
 * @param {string} menuData.items[].name - 항목의 이름입니다.
 * @param {number} menuData.items[].price - 항목의 가격입니다.
 * @param {string} [menuData.items[].description] - 항목에 대한 선택적 설명입니다.
 *
 * @returns {Promise<Object>} - API로부터의 응답 데이터가 포함된 프로미스를 반환합니다. 일반적으로 생성된 메뉴의 세부 사항이 포함됩니다.
 * @throws {Error} - API 요청 실패 또는 제공된 데이터에 문제가 있을 경우 에러를 발생시킬 수 있습니다.
 *
*/
// 메뉴 등록
export const createMenu = async (storeId, menuData) => {
    const response = await MenuAPI.post(
        `/api/stores/${storeId}/menus`,
        menuData,
        {
            headers: {
                ...getTokenHeaders(),
            },
        }
    )
    return response.data
}


/**
 * 특정 매장의 메뉴를 업데이트합니다.
 *
 * @param {string} storeId - 업데이트할 메뉴가 포함된 매장의 ID입니다.
 * @param {string} menuId - 업데이트할 메뉴의 ID입니다.
 * @param {Object} menuData - 업데이트할 메뉴의 데이터입니다. 변경할 메뉴에 대한 세부 정보를 포함해야 합니다.
 * @param {string} menuData.name - 메뉴의 새로운 이름입니다.
 * @param {string} [menuData.description] - 메뉴에 대한 새로운 선택적 설명입니다.
 * @param {Array<Object>} [menuData.items] - 메뉴에 포함된 항목들의 배열입니다. 기존 항목을 수정하거나 새로운 항목을 추가할 수 있습니다.
 * @param {string} [menuData.items[].name] - 항목의 새로운 이름입니다.
 * @param {number} [menuData.items[].price] - 항목의 새로운 가격입니다.
 * @param {string} [menuData.items[].description] - 항목에 대한 새로운 선택적 설명입니다.
 *
 * @returns {Promise<Object>} - API로부터의 응답 데이터가 포함된 프로미스를 반환합니다. 일반적으로 업데이트된 메뉴의 세부 사항이 포함됩니다.
 * @throws {Error} - API 요청 실패 또는 제공된 데이터에 문제가 있을 경우 에러를 발생시킬 수 있습니다.
 *
*/
// 메뉴 수정
export const updateMenu = async (storeId, menuId, menuData) => {
    console.log(`Updating menu: storeId=${storeId}, menuId=${menuId}`)
    const response = await MenuAPI.put(
        `/api/stores/${storeId}/menus/${menuId}`,
        menuData,
        {
            headers: {
                ...getTokenHeaders(),
            },
        }
    )
    return response.data
}

// 메뉴 삭제
export const deleteMenu = async (storeId, menuId) => {
    const response = await MenuAPI.delete(
        `/api/stores/${storeId}/menus/${menuId}`,
        {
            headers: getTokenHeaders(),
        }
    )
    return response.data
}
