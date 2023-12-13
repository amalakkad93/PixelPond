import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { selectAlbumImages, selectAlbumUserInfo } from "../../store/selectors";
import "./UserNavigationBar.css";

const UserNavigationBar = ({ id, photoCount, albumCount, onAboutClick, showAbout }) => {
  const userInfo = useSelector(selectAlbumUserInfo);
  const albumImages = useSelector(selectAlbumImages);
  const location = useLocation();

  // Compute the total number of albums and photos
  // const albumCount = userInfo ? userInfo.albums?.length : 0;
  // const photoCount = albumImages.length;

  // Check if the current path starts with a given path
  const isActive = (path) => {
    if (path === "/albums") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="user-navigation-bar">
      <div className="navigation-links">
        <a href="#!" onClick={onAboutClick} className={showAbout ? "active" : ""}>
          About
        </a>
        <a href={`/posts/users/${id}`} className={isActive(`/posts/users/${id}`) ? "active" : ""}>
          Photos {photoCount}
        </a>
        <a href={`/albums/users/${id}`} className={isActive(`/albums/users/${id}`) ? "active" : ""}>
          Albums {albumCount}
        </a>
        {/* <a href={`/albums/${id}`} className={isActive(`/albums/${id}`) ? "active" : ""}>
          Photos ({photoCount})
        </a> */}
      </div>
    </div>
  );
};

export default UserNavigationBar;
