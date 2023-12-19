import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { selectAlbumImages, selectAlbumUserInfo, selectSessionUser } from "../../store/selectors";
import { thunkGetPostsByUserId,  thunkGetLoggedInUserPosts } from "../../store/posts";
import OpenModalButton from "../Modals/OpenModalButton";
import CreatePostForm from "../Posts/PostForms/CreatePostForm";
import "./UserNavigationBar.css";

const UserNavigationBar = ({
  id,
  photoCount,
  albumCount,
  onAboutClick,
  showAbout,
  currentPage
}) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const sessionUser = useSelector(selectSessionUser);

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
        <a
          href="#!"
          onClick={onAboutClick}
          className={showAbout ? "active" : ""}
        >
          About
        </a>
        <a
          href={`/posts/users/${id}`}
          className={isActive(`/posts/users/${id}`) ? "active" : ""}
        >
          Photos {photoCount}
        </a>
        <a
          href={`/albums/users/${id}`}
          className={isActive(`/albums/users/${id}`) ? "active" : ""}
        >
          Albums {albumCount}
        </a>
        <a
          href={`/albums/${id}`}
          className={isActive(`/albums/${id}`) ? "active" : ""}
        >
          Album Photos {albumCount}
        </a>
        {location.pathname === "/owner/photostream" && (
          <OpenModalButton
            className="create-post-button navigation-link"
            buttonText="Create Post"
            modalComponent={
              <CreatePostForm
                onPostCreated={() =>

                  dispatch(
                    thunkGetPostsByUserId(
                      sessionUser.id,
                      currentPage,
                      10
                    )
                  )
                }
              />
            }
          />
        )}
      </div>
    </div>
  );
};

export default UserNavigationBar;
