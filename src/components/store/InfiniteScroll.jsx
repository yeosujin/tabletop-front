// InfiniteScroll.js
import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import StoreList from './StoreList.jsx';

const fetchMoreStores = (setStores, setHasMore) => {
  // API 호출로 더 많은 스토어 데이터를 가져옵니다.
  // 여기서는 예시로 setTimeout을 사용했습니다.
  setTimeout(() => {
    const newStores = Array.from({ length: 6 }, (_, index) => ({
      id: index + Math.random(),
      name: `Store ${index + 1}`,
      type: `임시`,
      image: `이미지를 등록하세요`,
      description: 'This is a store description.',
    }));

    setStores(prevStores => [...prevStores, ...newStores]);
    setHasMore(newStores.length > 0);
  }, 1500);
};

const InfiniteScrollComponent = () => {
  const [stores, setStores] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchMoreStores(setStores, setHasMore);
  }, []);

  return (
    <InfiniteScroll
      dataLength={stores.length}
      next={() => fetchMoreStores(setStores, setHasMore)}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
    >
      <StoreList stores={stores} />
    </InfiniteScroll>
  );
};

export default InfiniteScrollComponent;
