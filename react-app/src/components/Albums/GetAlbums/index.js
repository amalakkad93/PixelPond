

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetAlbums } from '../store/thunkAlbums';
import Pagination from '../components/Pagination';

const GetAlbums = () => {
    const dispatch = useDispatch();
    const { albums } = useSelector(state => state.albumReducer);
    const { currentPage, totalPages } = useSelector(state => state.paginationReducer);

    useEffect(() => {
        dispatch(thunkGetAlbums(currentPage, 10));
    }, [dispatch, currentPage]);

    return (
        <div>
            {/* Render album data */}
            <Pagination />
        </div>
    );
};

export default GetAlbums;
