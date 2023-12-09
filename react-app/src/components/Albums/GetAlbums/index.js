import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { thunkGetAlbumsByUserId } from '../../../store/albums';
import { setLoading, setError } from '../../../store/ui';
import Pagination from '../../Pagination';
import { selectAllAlbums, selectCurrentPage } from '../../../store/selectors';

const GetAlbums = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userId } = useParams();
  const albums = useSelector(selectAllAlbums);
  const currentPage = useSelector(selectCurrentPage);
  const perPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoading(true));
        await dispatch(thunkGetAlbumsByUserId(userId, currentPage, perPage));
        dispatch(setLoading(false));
      } catch (err) {
        dispatch(setError("An error occurred"));
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch, currentPage, perPage, userId]);

  const navigateToAlbum = (albumId) => {
    history.push(`/albums/${albumId}`);
  };

  return (
    <div className="albums-container">
      {albums.map((album) => (
        <div
          key={album.id}
          className="album-item"
          onClick={() => navigateToAlbum(album.id)}
        >
          {album.title}
        </div>
      ))}
       <Pagination />
    </div>
  );
};

export default GetAlbums;
