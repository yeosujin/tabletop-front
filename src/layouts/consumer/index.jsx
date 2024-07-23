import ConsumerHeader from './header'
import { Outlet, useParams, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { menuQuery } from '../../queries/menu'

const ConsumerLayout = () => {
    const [info, setInfo] = useState(null)
    const [error, setError] = useState(null)

    const { storeId } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()

    const tableNo = searchParams.get('tableNo')

    useEffect(() => {
        menuQuery
            .get(storeId)
            .then((response) => {
                setInfo(response.data)
            })
            .catch((err) => {
                setError(err)
                console.error('Error fetching menu:', err)
            })
    }, [storeId])

    if (error) return <div>Error loading menu information.</div>
    if (!info) return <div>Loading...</div>

    return (
        <div>
            {/* header */}
            <ConsumerHeader store={info.store} tableNo={tableNo} />

            {/* content */}
            <Outlet
                context={{
                    name: info.name,
                    description: info.description,
                    image_url: info.image_url,
                    is_available: info.is_available,
                    price: info.price,
                }}
            />

            {/* footer */}
        </div>
    )
}

export default ConsumerLayout
