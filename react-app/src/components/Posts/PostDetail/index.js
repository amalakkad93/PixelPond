import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faChevronRight,
  faChevronLeft,
  faSliders,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import {
  thunkGetPostDetails,
  thunkGetNeighborPosts,
} from "../../../store/posts";
import { thunkGetPostComments } from "../../../store/comments";
import { setLoading, setError, clearUIState } from "../../../store/ui";
import {
  selectSinglePost,
  selectUserInfo,
  selectNeighborPosts,
  selectLoading,
  selectSessionUser,
} from "../../../store/selectors";

import OpenModalButton from "../../Modals/OpenModalButton";

import EditPostForm from "../PostForms/EditPostForm";
import DeletePost from "../DeletePost";
import CommentsList from "../../Comments/CommentsList";
import CreateCommentForm from "../../Comments/CommentForm/CreateCommentForm";

import "./PostDetail.css";

export default function PostDetail() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { postId } = useParams();

  const sessionUser = useSelector(selectSessionUser);
  const post = useSelector(selectSinglePost);
  const userInfo = useSelector(selectUserInfo);
  const neighborPosts = useSelector(selectNeighborPosts);

  const userId = post?.owner_id;

  useEffect(() => {
    dispatch(clearUIState());
    fetchData();
  }, [dispatch, postId, userId]);

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));
      await dispatch(thunkGetPostDetails(postId));
      await dispatch(thunkGetNeighborPosts(postId, userId));
      await dispatch(thunkGetPostComments(postId, 1, 10));
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(setError("An error occurred"));
      dispatch(setLoading(false));
    }
  };

  const goToPost = (postId) => {
    if (postId) {
      history.push(`/posts/${postId}`);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-detail-container">
      <div className="main-content-container">
        <div className="image-container">
          {neighborPosts.prevPostId && (
            <button
              onClick={() => goToPost(neighborPosts.prevPostId)}
              className="prev-button"
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="pagination-icon"
              />
            </button>
          )}

          <LazyLoadImage
            src={post.image}
            alt={post.title}
            effect="blur"
            width="681"
            height="511"
            className="displayed-image"
          />

          {neighborPosts.nextPostId && (
            <button
              onClick={() => goToPost(neighborPosts.nextPostId)}
              className="next-button"
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className="pagination-icon"
              />
            </button>
          )}
          <div className="edit-delete-post-btn">
            {sessionUser && sessionUser.id === post.owner_id && (
              <>
                <OpenModalButton
                  className="edit-post-button"
                  buttonText={<FontAwesomeIcon icon={faSliders}  className="slider-icon"/>}
                  modalComponent={
                    <EditPostForm
                      postId={postId}
                      fetchPostDetailDat={fetchData}
                    />
                  }
                />
                <OpenModalButton
                  buttonText={
                    <FontAwesomeIcon icon={faTrash} className="trash-icon" />
                  }
                  modalComponent={
                    <DeletePost
                      postId={postId}
                      onDelete={() => {
                        if (neighborPosts.prevPostId) {
                          history.push(`/posts/${neighborPosts.prevPostId}`);
                        } else {
                          history.push("/owner/photostream");
                        }
                      }}
                    />
                  }
                />
              </>
            )}
          </div>
        </div>
        <div className="user-info-container">
          <div className="user-profile-picture-name-container">
            {userInfo && userInfo.profile_picture && (
              <img
                src={userInfo.profile_picture}
                alt={`${userInfo.first_name} ${userInfo.last_name}`}
                className="user-profile-picture"
              />
            )}
            <div className="user-name-container">
              <h3 className="user-name">
                {userInfo
                  ? `${userInfo.first_name} ${userInfo.last_name}`
                  : "User Name"}
              </h3>
            </div>
          </div>
          <div className="post-info-container">
            <h3 className="post-title">{post.title}</h3>
            <p className="post-description">{post.description}</p>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <CommentsList postId={postId} />
        <CreateCommentForm postId={postId} />
      </div>
    </div>
  );
}
