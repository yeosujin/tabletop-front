import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import StoreList from './StoreList.jsx';
import { getStoresAPI } from '../../apis/seller/SellerAPI.jsx';

const ITEMS_PER_PAGE = 6;

const InfiniteScrollComponent = ({ loginId }) => {
    const [allStores, setAllStores] = useState([]);
    const [displayedStores, setDisplayedStores] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isListChanged, setIsListChanged] = useState(false);

    useEffect(() => {
        fetchStores();
    }, [isListChanged]);

    // 전체 데이터 가져오기
    const fetchStores = async () => {
        await getStoresAPI(loginId)
            .then(response => {
                setAllStores(response);
                setDisplayedStores(response.slice(0, ITEMS_PER_PAGE));
                setHasMore(response.length > ITEMS_PER_PAGE);
            })
            .catch(error => {
                console.error('Error fetching stores:', error);
                setHasMore(false);
            });
    };

    // 전체 데이터에서 6개씩 더 가져오기
    const loadMoreStores = () => {
        const currentLength = displayedStores.length;
        const newStores = allStores.slice(currentLength, currentLength + ITEMS_PER_PAGE);
        setDisplayedStores(prevStores => [...prevStores, ...newStores]);
        setHasMore(allStores.length > currentLength + newStores.length);

        console.log('loadMoreStores: newStores', newStores);
        console.log('loadMoreStores: displayedStores', displayedStores);
    };

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
                >
                <StoreList stores={displayedStores} render={setIsListChanged}/>
                </InfiniteScroll>
            )}
        </>
    );
};

export default InfiniteScrollComponent;
