import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams  } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { ThunkGetAlbumImages } from "../../../store/albums";
import { setLoading, setError } from "../../../store/ui";
import { selectAlbumImages, selectCurrentPage, selectSinglePost, selectAlbumUserInfo } from "../../../store/selectors";
import Pagination from "../../Pagination";

import "./AlbumImages.css";

const AlbumImages = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const albumImages = useSelector(selectAlbumImages)|| [];
  const albumUserInfo = useSelector(selectAlbumUserInfo);

  console.log("🚀 ~ file: index.js:13 ~ AlbumImages ~ albumImages :", albumImages )
  const currentPage = useSelector(selectCurrentPage);
  const post = useSelector(selectSinglePost);
  console.log("🚀 ~ file: index.js:16 ~ AlbumImages ~ post:", post)
  const {albumId } = useParams();
  const perPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoading(true));
        await dispatch(ThunkGetAlbumImages(albumId, currentPage, perPage));
        dispatch(setLoading(false));
      } catch (err) {
        dispatch(setError("An error occurred"));
        dispatch(setLoading(false));
      }
    };

    fetchData();

  }, [dispatch, currentPage, perPage, albumId]);

if (!albumImages || albumImages.length === 0) return null;
  return (
    <div album-image-container>
            <div className="banner">
        <LazyLoadImage
          src={albumImages[0]?.url}

          effect="blur"
          width={"100%"}
          className="banner-image"
        />
        <div className="user-details">
          <img
            className="profile-picture"
            src={albumUserInfo.profile_picture}
            alt={albumUserInfo.username}
          />
          <div className="user-name">
            <h1 className="user-name-h1">
              {albumUserInfo.first_name} {albumUserInfo.last_name}
            </h1>
          </div>
        </div>
      </div>
      <h2>Album Images</h2>
      <div
        key={albumId}
        className="image-gallery"
        onClick={() => history.push(`/posts/${albumId}`)}
      >
        {albumImages.map((image) => (
          <img
            key={image.id}
            src={image.url}
            alt={`Album Image ID ${image.id}`}
            className="image-item"
          />
        ))}
      </div>
      <Pagination />
    </div>
  );
};

export default AlbumImages;
