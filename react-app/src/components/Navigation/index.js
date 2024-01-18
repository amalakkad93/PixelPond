import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useHistory } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLoading } from "../../context/LoadingContext";
import ProfileButton from "./ProfileButton";
import PopupsModal from "../Modals/PopupsModal";
import BannerNavbar from "./BannerNavbar";
import UserNavigationBar from "./UserNavigationBar";
import Spinner from "../Spinner";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import {
  thunkGetAllTags,
  thunkGetPostsByTags,
  actionSetSelectedTags,
} from "../../store/tags";
import {
  selectPostUserInfo,
  selectAlbumUserInfo,
  selectAllTags,
  selectSessionUser,
} from "../../store/selectors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCameraRetro,
  faUserCircle,
  faImages,
} from "@fortawesome/free-solid-svg-icons";

import logo from "../../assets/images/logo.png";
import TagSearch from "../Tags/TagSearch";
import SearchBar from "../SearchBar";
import "./Navigation.css";

function Navigation({ isLoaded, }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { isLoading } = useLoading();

  const sessionUser = useSelector(selectSessionUser);
  const postUserInfo = useSelector(selectPostUserInfo);
  const albumUserInfo = useSelector(selectAlbumUserInfo);
  const allTags = useSelector(selectAllTags);
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isOwner, setIsOwner] = useState(null);

  const isFavoritesPage = location.pathname.includes("/user/favorites-post");

  const displayBannerRoutes = [
    "/user/favorites-post",
    "/posts/users/:userId",
    "/owner/photostream",
    "/owner/albums",
    "/owner/posts/add",
    "/user/favorites-post",
    "/posts/favorites-post",
    "/albums/users/:userId",
    "/albums/:albumId",
  ];

  // Determine which userInfo to use
  let userInfo;
  if (location.pathname.includes("/albums/")) {
    userInfo = albumUserInfo;
  } else if (isFavoritesPage) {
    userInfo = sessionUser;
  } else {
    userInfo = postUserInfo;
  }

  useEffect(() => {
    if (userInfo && sessionUser) {
      setIsOwner(sessionUser.id === userInfo.id);
    }
  }, [userInfo, sessionUser]);

  useEffect(() => {
    dispatch(thunkGetAllTags());
  }, [dispatch]);

  const shouldDisplayBanner = displayBannerRoutes.some((path) =>
    location.pathname.includes(path.replace(/:\w+/g, ""))
  );

  const handleTagSelection = (tag) => {
    const currentURL = new URL(window.location);
    let tags = currentURL.searchParams.getAll("tags");

    if (tags.includes(tag)) {
      // Remove the tag if it's already selected
      tags = tags.filter((t) => t !== tag);
    } else {
      // Add the new tag
      tags.push(tag);
    }

    const newQueryParams = new URLSearchParams();
    tags.forEach((t) => newQueryParams.append("tags", t));

    history.push(`/explore?${newQueryParams.toString()}`);
  };

  if (isLoading) return null;

  return (
    <>
      <div className="navbar-content">
        <nav className="navbar">
          <NavLink exact to="/posts/all" className="navbar-logo">
            <img src={logo} alt="logo" className="logo" />
          </NavLink>

          <SearchBar
            className="tag-search-container"
            allTags={allTags}
            onTagSelected={handleTagSelection}
            onTagClear={() => history.push("/posts/all")}
          />
          <ul className="navbar-links">
            <div class="menu">
              <li className="explore-icon">
                <NavLink to="/explore" activeClassName="active">
                  <FontAwesomeIcon icon={faCameraRetro} /> Explore
                </NavLink>
              </li>

              {sessionUser && (
                <li
                  className="pop-modal-trigger"
                  onClick={() => setShowModal(!showModal)}
                >
                  <span className="white-icon">You</span>
                  {showModal && (
                    <PopupsModal
                      showModal={showModal}
                      onClose={() => setShowModal(false)}
                    />
                  )}
                </li>
              )}

              {isLoaded && (
                <li>
                  <ProfileButton
                    className="profile-btn"
                    user={sessionUser}
                    showMenu={showMenu}
                  />
                </li>
              )}
              <ThemeToggle className="theme-toggle" />
            </div>
          </ul>
        </nav>
      </div>
      {shouldDisplayBanner && !isLoading && (
        <>
          <BannerNavbar userInfo={userInfo} />
          <UserNavigationBar
            id={userInfo?.id}
            userInfo={userInfo}
            isOwner={isOwner}
          />
        </>
      )}
    </>
  );
}

export default Navigation;
