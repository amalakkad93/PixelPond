import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, NavLink } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";


import "./PhotoStream.css";

export default function PhotoStream() {
  const dispatch = useDispatch();
  const { userId, albumId } = useParams();
  // Replace with appropriate selectors and actions
  const user = useSelector(/* selector for user details */);
  const photos = useSelector(/* selector for album photos */);

  useEffect(() => {
    // Dispatch actions to fetch user details and album photos
  }, [dispatch, userId, albumId]);

  // Check for loading and error states
  // ...

  return (
    <div className="photo-stream-container">
      <div className="banner">
        {/* User banner and details */}
      </div>

      <nav className="album-navigation">
        <NavLink to={`/users/${userId}/about`} activeClassName="active">About</NavLink>
        <NavLink to={`/users/${userId}/photostream`} activeClassName="active">Photostream</NavLink>
        <NavLink to={`/users/${userId}/albums`} activeClassName="active">Albums</NavLink>
      </nav>

      <div className="photo-grid">
        {photos.map((photo, index) => (
          <LazyLoadImage
            key={index}
            src={photo.url}
            alt={`Photo ${index}`}
            effect="blur"
          />
        ))}
      </div>

 
    </div>
  );
}
