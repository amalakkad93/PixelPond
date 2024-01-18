/**
 * FavoritesPosts Component
 *
 * This component is responsible for displaying a user's favorite posts. It fetches the user's favorite
 * posts from the server and renders them in a list. Each post can be clicked to navigate to its details.
 * Users can also toggle the favorite status of each post directly from this list. The component uses Redux
 * for state management and dispatching actions related to fetching and toggling favorites.
 *
 * The component also provides a back button to navigate to the previous page.
 */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faStar as solidStar,
} from "@fortawesome/free-solid-svg-icons";
import {
  thunkFetchAllFavorites,
  thunkToggleFavorite,
} from "../../store/favorites";
import { selectSessionUser, selectAllFavorites } from "../../store/selectors";

import "./FavoritesPosts.css";

export default function FavoritesPosts() {
  const dispatch = useDispatch();
  const history = useHistory();

  // Extract the user ID and favorite posts from the Redux store
  const sessionUser = useSelector(selectSessionUser);
  const userId = sessionUser?.id;
  const favorites = useSelector(selectAllFavorites);

  // Check if there are any favorite posts
  const hasFavorites = favorites.length > 0;

  // useEffect hook to fetch all favorites for the user when the component mounts
  useEffect(() => {
    if (userId) {
      dispatch(thunkFetchAllFavorites(userId));
    }
  }, [dispatch, userId]);

  // Handle click event for toggling a post's favorite status
  const handleFavoriteClick = (e, postId) => {
    e.stopPropagation();
    e.preventDefault();
    if (userId) {
      dispatch(thunkToggleFavorite(userId, postId));
    }
  };

  return (
    <>
    {/* Back button to navigate to the previous page */}
      <div
        className="Back-to-Home"
        style={{ marginLeft: "73px", color: "black" }}
      >
        <button
          className="Back-to-Home-btn"
          onClick={() => history.goBack()}
          style={{
            color: "black",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Previous Page
        </button>
      </div>

       {/* Render list of favorite posts or a message if there are none */}
      <div
        className={`post-list ${
          hasFavorites ? "with-favorites" : "no-favorites"
        }`}
      >
        {hasFavorites ? (
          favorites.map((favorite) => (
            // Render each favorite post with image, title, description, and a toggle favorite button
            <div
              key={favorite?.post?.id}
              className="post-card"
              title={favorite?.post?.title}
              onClick={() => history.push(`/posts/${favorite?.post?.id}`)}
            >
              <img
                src={favorite?.post?.image_url}
                alt={`Post: ${favorite?.post?.title}`}
                className="post-image"
              />
              <FontAwesomeIcon
                icon={solidStar}
                className="favorite-heart"
                onClick={(e) => handleFavoriteClick(e, favorite?.post?.id)}
              />
              <div className="post-details">
                <h3 className="post-title">{favorite?.post?.title}</h3>
                <p className="post-description">{favorite?.post?.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-favorites-message">
            <p>You have no favorites yet.</p>
          </div>
        )}
      </div>
    </>
  );
}
