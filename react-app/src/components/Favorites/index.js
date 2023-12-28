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
import { selectSessionUser, selectAllFavorites } from "../../store/selectors"; // Adjust these import paths

import "./FavoritesPosts.css";

export default function FavoritesPosts() {
  const dispatch = useDispatch();
  const history = useHistory();

  // Extract the user ID from the Redux store
  const sessionUser = useSelector(selectSessionUser);
  const userId = sessionUser?.id;

  // Extract favorite posts from the Redux store
  const favorites = useSelector(selectAllFavorites);

  // Fetch all favorites for the user when the component mounts
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

  const hasFavorites = favorites.length > 0;

  return (
    <>
      <div
        className="Back-to-Home"
        style={{ marginLeft: "73px", color: "black" }}
      >
        <button
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

      <div
        className={`post-list ${
          hasFavorites ? "with-favorites" : "no-favorites"
        }`}
      >
        {favorites.map((favorite) => (
          <div
            key={favorite.post.id}
            className="post-card"
            title={favorite.post.title}
            onClick={() => history.push(`/posts/${favorite.post.id}`)}
          >
            <img
              src={favorite.post.image_url}
              alt={`Post: ${favorite.post.title}`}
              className="post-image"
            />

            <FontAwesomeIcon
              icon={solidStar}
              className="favorite-heart"
              onClick={(e) => handleFavoriteClick(e, favorite.post.id)}
            />

            <div className="post-details">
              <h3 className="post-title">{favorite.post.title}</h3>
              <p className="post-description">{favorite.post.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
