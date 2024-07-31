import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import StoreList from './StoreList.jsx';

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
        const url = `http://localhost:8080/api/stores/${loginId}`;

        const TOKEN_TYPE = localStorage.getItem("tokenType");
        const ACCESS_TOKEN = localStorage.getItem("accessToken");
        let REFRESH_TOKEN = localStorage.getItem("refreshToken");

        await axios.get(url, {
            headers: {
                'Authorization': `${TOKEN_TYPE} ${ACCESS_TOKEN}`,
                'REFRESH_TOKEN': REFRESH_TOKEN
            }
        })
            .then(response => {
                setAllStores(response.data);
                setDisplayedStores(response.data.slice(0, ITEMS_PER_PAGE));
                setHasMore(response.data.length > ITEMS_PER_PAGE);
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
        console.log('loadMoreStores: newStores', newStores);
        console.log('loadMoreStores: displayedStores', displayedStores);
        setHasMore(allStores.length > currentLength + newStores.length);
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
