import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";

import { selectSessionUser, selectAlbumUserInfo } from "../../store/selectors";

import "./UserNavigationBar.css";


const UserNavigationBar = ({
  id,
  photoCount,
  albumCount,
  userInfo,
  isOwner,
  setIsOwner,
}) => {
  const location = useLocation();
  const history = useHistory();
  const sessionUser = useSelector(selectSessionUser);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path);
  const effectiveId = id || sessionUser?.id;
  const about = userInfo?.about_me;
  const aboutContent = about || "No 'About Me' information available.";



  const toggleAboutModal  = () => {
    setShowAboutModal(!showAboutModal);
  };

  const photosUrl = isOwner ? "/owner/photostream" : `/posts/users/${effectiveId}`;

  const handlePhotosClick = (e) => {
    e.preventDefault();
    history.push(photosUrl);
  };

  if (isOwner === null) return null;

  return (
    <>
    <div className="user-navigation-bar">
      <div className="navigation-links">
        <a
          href="#!"
          onClick={(e) => {
            e.preventDefault();
            toggleAboutModal();
          }}
          className={showAboutModal ? "active" : ""}
        >
          {isOwner && isOwner ? "About Me" : "About"}
        </a>
        <a
          href={photosUrl}
          onClick={handlePhotosClick}
          className={isActive(photosUrl) ? "active" : ""}
        >
          {isOwner && isOwner ? "My PhotoStream" : "PhotoStream"} {photoCount}
        </a>
        <a
          href={`/albums/users/${effectiveId}`}
          className={isActive(`/albums/users/${effectiveId}`) ? "active" : ""}
        >
          {isOwner && isOwner ? "My Albums" : "Albums"} {albumCount}
        </a>
        {isOwner && (
          <a
            href={`/user/favorites-post`}
            className={isActive(`/user/favorites-post`) ? "active" : ""}
          >
            View Favorites
          </a>
        )}
      </div>
    </div>
    {showAboutModal && (
      <div className="about-dropdown">
         <p>{aboutContent}</p>
      </div>
    )}
    </>
  );
};

export default UserNavigationBar;
