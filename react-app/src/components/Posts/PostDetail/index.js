import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import { thunkGetPostDetails } from "../../../store/posts";
import { setLoading, setError } from "../../../store/ui";
import { selectSinglePost } from "../../../store/selectors";
import "./PostDetail.css";

export default function PostDetail() {
  const dispatch = useDispatch();
  const isMountedRef = useRef(true);
  const { postId } = useParams();
  const post = useSelector(selectSinglePost);
  const { loading, error } = useSelector((state) => state.ui);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        dispatch(setLoading(true));
        const res = await dispatch(thunkGetPostDetails(postId));
        console.log(
          "🚀 ~ file: index.js:22 ~ fetchPostDetails ~ postId:",
          postId
        );
        console.log("🚀 ~ file: index.js:22 ~ fetchPostDetails ~ res:", res);
      } catch (error) {
        dispatch(setError(`Error fetching post details: ${error.message}`));
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (postId) {
      fetchPostDetails();
    }
  }, [dispatch, postId]);

  if (loading) return null;

  if (!post) return null;

  return (
    <div className="post-detail-container">
      <div className="banner">
        <LazyLoadImage
          src={post.banner_url}
          alt={post.title}
          effect="blur"
          width={"100%"}
          className="banner-image"
        />
        <div className="user-details">
          <img
            className="profile-picture"
            src={post.profile_picture}
            alt={post.username}
          />
          <div className="user-name">
            <h1 className="user-name-h1">
              {post.first_name} {post.last_name}
            </h1>
          </div>
        </div>
      </div>

      <div className="post-info-container">
        <h2>{post.title}</h2>
        <p>{post.description}</p>

        <div className="image-grid">
          {post.image_urls && (
            <div className="image-grid">
              {post.image_urls.map((url, index) => (
                <LazyLoadImage
                  key={index}
                  src={url}
                  alt={`Image ${index}`}
                  effect="blur"
                />
              ))}
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="comments-section">{/* Render comments here */}</div>
      </div>
    </div>
  );
}
