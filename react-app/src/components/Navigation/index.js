import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import ProfileButton from "./ProfileButton";
import PopupsModal from "../Modals/PopupsModal";
import BannerNavbar from "./BannerNavbar";
import UserNavigationBar from "./UserNavigationBar";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { selectPostUserInfo, selectAlbumUserInfo } from "../../store/selectors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCameraRetro,
  faUserCircle,
  faImages,
} from "@fortawesome/free-solid-svg-icons";

import logo from "../../assets/images/logo.png";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const location = useLocation();
  const sessionUser = useSelector((state) => state.session.user);
  const postUserInfo = useSelector(selectPostUserInfo);
  const albumUserInfo = useSelector(selectAlbumUserInfo);
  console.log("🚀 ~ file: index.js:23 ~ Navigation ~ userInfo:", postUserInfo);
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [userData, setUserData] = useState(null);
  const [albumData, setAlbumData] = useState(null);

  // const toggleModal = () => setShowModal(!showModal);
  const toggleModal = () => {
    console.log("---Toggling modal:", !showModal);
    setShowModal(!showModal);
  };

  const displayBannerRoutes = [
    "/user/favorites-post",
    "/posts/users/:userId",
    "/owner/photostream",
    "/owner/albums",
    "/owner/posts/add",
    //"/posts/users/:userId/favorites-post",
    "/user/favorites-post",
    "/posts/favorites-post",
    "/albums/users/:userId",
    "/albums/:albumId",
  ];
 // const isFavoritesPage = location.pathname.includes("/posts/users/:userId/favorites-post");
  const isFavoritesPage = location.pathname.includes("/user/favorites-post");
  // Determine which userInfo to use
  let userInfo;
  if (location.pathname.includes("/albums/")) {
    userInfo = albumUserInfo;
  } else if (isFavoritesPage) {
    userInfo = sessionUser;
  } else {
    userInfo = postUserInfo;
  }

  const shouldDisplayBanner = displayBannerRoutes.some((path) =>
    location.pathname.includes(path.replace(/:\w+/g, ""))
  );
console.log("🚀 ~ file: index.js:71 ~ Navigation ~ shouldDisplayBanner", shouldDisplayBanner)
  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <NavLink exact to="/posts/all" className="navbar-logo">
            <img src={logo} alt="logo" className="logo-img" />
          </NavLink>

          <ul className="navbar-links">
            <li>
              <NavLink to="/explore" activeClassName="active">
                <FontAwesomeIcon icon={faCameraRetro} />
                Explore
              </NavLink>
            </li>

            {sessionUser && (
              <li className="pop-modal-trigger" onClick={toggleModal}>
                <span className="white-icon">You</span>

                {/* <FontAwesomeIcon icon={faUserCircle} className="white-icon" /> */}

                {/* <span>{sessionUser.username}</span> */}
                {showModal && (
                  <PopupsModal
                    showModal={showModal}
                    onClose={() => setShowModal(false)}
                  />
                )}
              </li>
            )}

            {isLoaded && (
              <ul className="navBar-far-right">
                <li>
                  <ProfileButton user={sessionUser} showMenu={showMenu} />
                </li>
              </ul>
            )}
            <ThemeToggle/>
          </ul>
        </div>
      </nav>
      {shouldDisplayBanner && (
      //{shouldDisplayBanner && userInfo && (
        <>
          <BannerNavbar
            userInfo={userInfo}
          />
          <UserNavigationBar
          id={userInfo?.id}
            userInfo={userInfo}
          />
        </>
      )}
    </>
  );
}

export default Navigation;
