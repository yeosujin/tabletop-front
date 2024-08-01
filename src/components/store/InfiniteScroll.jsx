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
<<<<<<< Updated upstream
        const url = `http://localhost:8080/api/stores/${loginId}`;

        await axios.get(url)
=======
        await getStoresAPI(loginId)
>>>>>>> Stashed changes
            .then(response => {
                // const data = response.data.map(store => {
                //     const base64Image = store.imageBase64;
                    
                //     if (base64Image) {
                //         const image = new Image();
                //         image.src = 'data:image/jpeg;base64,' + base64Image;
                //         store.image = image;
                //     }

                //     return store;
                // });
                // console.log(data.store[2].image);

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
