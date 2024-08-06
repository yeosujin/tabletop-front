import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import StoreList from './StoreList.jsx'
import { getStoresAPI } from '../../apis/seller/SellerAPI.jsx'

const ITEMS_PER_PAGE = 8

const InfiniteScrollComponent = ({ loginId, onModifyClick, isListChanged, setIsListChanged }) => {
    const [allStores, setAllStores] = useState([])
    const [displayedStores, setDisplayedStores] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStores()
    }, [isListChanged])

    // 전체 데이터 가져오기
    const fetchStores = async () => {
        await getStoresAPI(loginId).then((response) => {
            setAllStores(response)
            setDisplayedStores(response.slice(0, ITEMS_PER_PAGE))
            setHasMore(response.length > ITEMS_PER_PAGE)
        }).finally(
            setIsLoading(false)
        )
    }

    // 전체 데이터에서 8개씩 더 가져오기
    const loadMoreStores = () => {
        const currentLength = displayedStores.length
        const newStores = allStores.slice(
            currentLength,
            currentLength + ITEMS_PER_PAGE
        )
        setDisplayedStores((prevStores) => [...prevStores, ...newStores])
        setHasMore(allStores.length > currentLength + newStores.length)
    }

    if (isLoading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <>
            {allStores.length === 0 ? (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                    }}
                >
                    <h2>등록된 가게가 없습니다.</h2>
                </div>
            ) : (
                <InfiniteScroll
                    dataLength={displayedStores.length}
                    next={loadMoreStores}
                    hasMore={hasMore}
                    loader={
                        <div
                            style={{
                                margin: '10px 0',
                                // display: 'flex',
                                // justifyContent: 'center',
                                // scrollbarWidth: 'none',
                                // overflow: 'hidden',
                            }}
                        >
                            <h3>Loading...</h3>
                        </div>
                    }
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
