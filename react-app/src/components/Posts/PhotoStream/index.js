import React, { useEffect, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, NavLink } from "react-router-dom";
import Masonry from "react-masonry-css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { thunkGetPostsByUserId } from "../../../store/posts";
import { setLoading, setError } from "../../../store/ui";
import Pagination from "../../Pagination";
import UserNavigationBar from "../../Navigation/UserNavigationBar";
import {
  selectUserPosts,
  selectCurrentPage,
  selectSinglePost,
  selectAlbumUserInfo,
  selectFirstUserPostProfilePicture,
} from "../../../store/selectors";
import "./PhotoStream.css";

const PhotoItem = memo(({ photo }) => (
  <div className="photo-item">
    <LazyLoadImage src={photo} alt="Photo" effect="blur" />
  </div>
));

const PhotoStream = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const userPosts = useSelector(selectUserPosts);
  const currentPage = useSelector(selectCurrentPage);
  const profilePicture = useSelector(selectFirstUserPostProfilePicture);

  const [showAbout, setShowAbout] = useState(false);
  const userInfo = useSelector(selectAlbumUserInfo);

  const perPage = 10;
  const totalPhotos = userPosts.reduce((acc, post) => acc + post.photo_urls.length, 0);
  const aboutMe = userPosts[0]?.about_me;
  const bannerImageUrl = userPosts[0]?.photo_urls[0];

  const toggleAbout = () => setShowAbout(!showAbout);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoading(true));
        await dispatch(thunkGetPostsByUserId(userId, currentPage, perPage));
        dispatch(setLoading(false));
      } catch (err) {
        dispatch(setError("An error occurred"));
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch, currentPage, perPage, userId]);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <>
      <div className="banner-container">
        {bannerImageUrl && (
          <div className="banner">
            <LazyLoadImage
              src={bannerImageUrl}
              effect="blur"
              className="banner-image"
            />
            <div className="user-details">
              {profilePicture && (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="profile-picture"
                />
              )}
              <div className="user-name">
                <h1>User Name</h1>
                {/* Add more user info if needed */}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="photo-stream-container">
        <nav className="album-navigation">
          <UserNavigationBar id={userId} photoCount={totalPhotos} onAboutClick={toggleAbout} />
        </nav>
        {showAbout && (
          <div className="about-section">
            <p>{aboutMe || "No about me information available."}</p>
          </div>
        )}
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="photo-grid"
          columnClassName="photo-grid_column"
        >
          {userPosts.map((post) =>
            post.photo_urls.map((photo, index) => (
              <PhotoItem key={index} photo={photo} />
            ))
          )}
        </Masonry>

        <Pagination />
      </div>
    </>
  );
};

export default PhotoStream;
