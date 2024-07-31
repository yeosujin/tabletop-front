import menu1 from './menu1.jpg'

export const get = (storeId) => {
    return new Promise((resolve, reject) => {
        const value = {
            data: {
                name: 'menu1',
                description: 'description1',
                price: 1000,
                is_available: true,
                image_url: menu1,
                store: {
                    name: 'store name 111',
                    description: 'store description',
                    address: '서울특별시 강남구',
                    store_type: 'short',
                    notice: null,
                    corporate_registration_number: '000-00-00000',
                    open_date: '20240404',
                    close_date: '20240504',
                    open_time: '9:00',
                    close_time: '21:00',
                },
            },
        }
        resolve(value)
    })
}

export const menuQuery = {
    get: get,
}
