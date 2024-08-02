import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import StoreList from './StoreList.jsx'
import { getStoresAPI } from '../../apis/seller/SellerAPI.jsx'

const ITEMS_PER_PAGE = 6

const InfiniteScrollComponent = ({ loginId, onModifyClick, isListChanged, setIsListChanged }) => {
    const [allStores, setAllStores] = useState([])
    const [displayedStores, setDisplayedStores] = useState([])
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        fetchStores()
    }, [isListChanged])

    // 전체 데이터 가져오기
    const fetchStores = async () => {
        await getStoresAPI(loginId).then((response) => {
            setAllStores(response)
            setDisplayedStores(response.slice(0, ITEMS_PER_PAGE))
            setHasMore(response.length > ITEMS_PER_PAGE)
        })
    }

    // 전체 데이터에서 6개씩 더 가져오기
    const loadMoreStores = () => {
        const currentLength = displayedStores.length
        const newStores = allStores.slice(
            currentLength,
            currentLength + ITEMS_PER_PAGE
        )
        setDisplayedStores((prevStores) => [...prevStores, ...newStores])
        setHasMore(allStores.length > currentLength + newStores.length)
    }

    return (
        <>
            {allStores.length === 0 ? (
                <h4>no data to display...</h4>
            ) : (
                <InfiniteScroll
                    dataLength={displayedStores.length}
                    next={loadMoreStores}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        scrollbarWidth: 'none',
                        overflow: 'hidden',
                    }}
                >
                    <StoreList
                        stores={displayedStores}
                        render={setIsListChanged}
                        onModifyClick={onModifyClick}
                    />
                </InfiniteScroll>
            )}
        </>
    )
}

export default InfiniteScrollComponent
