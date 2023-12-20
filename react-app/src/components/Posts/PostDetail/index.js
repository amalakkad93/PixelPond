import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
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
  clearPostsData,
  clearPostDetails,
} from "../../../store/posts";
import { fetchUserInfoById } from "../../../store/session";
import { thunkGetPostComments } from "../../../store/comments";
import { setLoading, setError, clearUIState } from "../../../store/ui";
import {
  selectSinglePost,
  selectUserInfo,
  selectNeighborPosts,
  selectLoading,
  selectSessionUser,
  selectUserById,
} from "../../../store/selectors";

import OpenModalButton from "../../Modals/OpenModalButton";

import EditPostForm from "../PostForms/EditPostForm";
import DeletePost from "../DeletePost";
import CommentsList from "../../Comments/CommentsList";
import CreateCommentForm from "../../Comments/CommentForm/CreateCommentForm";
import Spinner from "../../Spinner";

import "./PostDetail.css";

export default function PostDetail() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { postId } = useParams();

  const sessionUser = useSelector(selectSessionUser);
  const post = useSelector(selectSinglePost);
  // const userInfo = useSelector(selectUserInfo);
  // const userInfo = useSelector(selectUserById);
  const userInfo = post?.user_info;
  console.log("🚀 ~ file: index.js:53 ~ PostDetail ~ userInfo:", userInfo )
  const neighborPosts = useSelector(selectNeighborPosts);
  const loading = useSelector(selectLoading);
  const userId = post?.owner_id;
  console.log("🚀 ~ file: index.js:53 ~ PostDetail ~ userId :", userId )

  // const fetchData = useCallback(async () => {
  //   try {
  //     dispatch(setLoading(true));
  //     await dispatch(thunkGetPostDetails(postId));
  //     await dispatch(thunkGetNeighborPosts(postId, userId));
  //     await dispatch(thunkGetPostComments(postId, 1, 10));
  //     dispatch(setLoading(false));
  //   } catch (err) {
  //     dispatch(setError("An error occurred"));
  //   } finally {
  //     dispatch(setLoading(false));
  //   }
  // }, [dispatch, postId, userId]);
  const fetchData = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      await Promise.all([
        dispatch(thunkGetPostDetails(postId)),
        // dispatch(fetchUserInfoById(userId)),
        dispatch(thunkGetNeighborPosts(postId, userId)),
        dispatch(thunkGetPostComments(postId, 1, 10)),
      ]);
    } catch (err) {
      dispatch(setError("An error occurred"));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, postId, userId]);

  useEffect(() => {
    dispatch(clearPostDetails());
    dispatch(clearUIState());
  }, [dispatch, postId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  console.log("🚀 ~ file: index.js:185 ~ PostDetail ~ post:", post);
  if (loading && (!post || !post.image_url)) return <Spinner />;
  if (!post || !post.image_url) return null;

  return (
    <CSSTransition
      in={!!post}
      timeout={300}
      classNames="post-transition"
      unmountOnExit
    >
      <div className="post-detail-container">
        <div className="main-content-container">
          <div className="image-container">
            {neighborPosts.prevPostId && (
              <button
                onClick={() => {
                  if (neighborPosts.prevPostId) {
                    history.push(`/posts/${neighborPosts.prevPostId}`);
                  }
                }}
                className="prev-button"
              >
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="pagination-icon"
                />
              </button>
            )}

            <LazyLoadImage
              src={post.image_url}
              alt={post.title}
              effect="blur"
              width="681"
              height="400"
              className="displayed-image"
            />

            {neighborPosts.nextPostId && (
              <button
                className="next-button"
                onClick={() => {
                  if (neighborPosts.nextPostId) {
                    history.push(`/posts/${neighborPosts.nextPostId}`);
                  }
                }}
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
                    buttonText={
                      <FontAwesomeIcon
                        icon={faSliders}
                        className="slider-icon"
                      />
                    }
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
              {userInfo && userInfo?.profile_picture && (
                <img
                  src={userInfo?.profile_picture}
                  alt={`${userInfo.first_name} ${userInfo.last_name}`}
                  className="user-profile-picture"
                />
              )}
              <div className="user-name-container">
                <h3 className="user-name">
                  {userInfo && userInfo.first_name && userInfo.last_name
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
    </CSSTransition>
  );
}
