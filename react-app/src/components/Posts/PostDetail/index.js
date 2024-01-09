import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import {
  faChevronRight,
  faChevronLeft,
  faSliders,
  faTrash,
  faStar as solidStar,
} from "@fortawesome/free-solid-svg-icons";

import {
  thunkGetPostDetails,
  thunkGetNeighborPosts,
  clearPostsData,
  clearPostDetails,
} from "../../../store/posts";
import { fetchUserInfoById } from "../../../store/session";
import {
  thunkGetPostComments,
  actionAddComment,
  actionClearComments,
} from "../../../store/comments";
import { setLoading, setError, clearUIState } from "../../../store/ui";
import {
  thunkToggleFavorite,
  thunkFetchAllFavorites,
} from "../../../store/favorites";
import {
  selectSinglePost,
  selectPostUserInfo,
  selectNeighborPosts,
  selectLoading,
  selectSessionUser,
  selectUserById,
  isPostFavorited,
} from "../../../store/selectors";

import OpenModalButton from "../../Modals/OpenModalButton";
import OpenShortModalButton from "../../Modals/OpenShortModalButton";

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
  const userInfo = post?.user_info;
  const neighborPosts = useSelector(selectNeighborPosts);
  const loading = useSelector(selectLoading);
  const userId = post?.owner_id;

  const favorite = useSelector((state) => isPostFavorited(state, postId));

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    if (userId) {
      await dispatch(thunkToggleFavorite(userId, postId));
      // await fetchData();
    }
  };

  const fetchData = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const promises = [dispatch(thunkGetPostDetails(postId))];
      if (userId !== undefined) {
        promises.push(dispatch(thunkGetNeighborPosts(postId, userId)));
      }
      await Promise.all(promises);
    } catch (err) {
      dispatch(setError("An error occurred"));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, postId, userId]);

  useEffect(() => {
    dispatch(thunkFetchAllFavorites(sessionUser?.id));
    fetchData();
  }, [fetchData, dispatch, sessionUser?.id, postId]);

  useEffect(() => {
    dispatch(clearPostDetails());
    dispatch(actionClearComments());
    dispatch(clearUIState());
  }, [dispatch, postId]);


  if ( !post || !post.image_url || !neighborPosts) return null;

  return (
    <CSSTransition
      in={!!post}
      timeout={300}
      classNames="post-transition"
      unmountOnExit
    >
      <div className="post-detail-container">
        <div className="post-main-content-container">
          <div className="post-detail-top-container">
            {/* Image Container */}
            <div className="image-container">
              <LazyLoadImage
                // src={post.image_url}
                src={`${post.image_url}?v=${new Date().getTime()}`} 
                alt={post.title}
                effect="blur"
                className="displayed-image"
              />
              {/* Navigation Buttons */}
              {neighborPosts.prevPostId && (
                <button
                  className="prev-button"
                  onClick={() =>
                    history.push(`/posts/${neighborPosts.prevPostId}`)
                  }
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
              )}
              {neighborPosts.nextPostId && (
                <button
                  className="next-button"
                  onClick={() =>
                    history.push(`/posts/${neighborPosts.nextPostId}`)
                  }
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              )}
            </div>
            <div className="edit-delete-fav-btns">
              {/* Favorite Button */}
              <button
                onClick={handleFavoriteToggle}
                className="favorite-button"
              >
                <FontAwesomeIcon
                  icon={favorite ? solidStar : regularStar}
                  className="favorite-icon"
                />
              </button>
              {/* Edit and Delete Buttons */}
              {sessionUser && sessionUser.id === post.owner_id && (
                <div className="edit-delete-post-btn">
                  <OpenShortModalButton
                    className="edit-post-button"
                    buttonText={<FontAwesomeIcon icon={faSliders} />}
                    modalComponent={
                      <EditPostForm
                        postId={postId}
                        fetchPostDetailDat={fetchData}
                      />
                    }
                  />
                  <OpenShortModalButton
                    className="delete-post-button"
                    buttonText={<FontAwesomeIcon icon={faTrash} />}
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
                </div>
              )}
            </div>
          </div>
          {/* User and Post Information */}
          <div className="post-detail-bottom-container">
            <div className="details-comments-container">
              <div className="user-post-info">
                {userInfo && (
                  <>
                    <img
                      src={userInfo.profile_picture}
                      alt={`${userInfo.first_name} ${userInfo.last_name}`}
                      className="user-profile-picture"
                    />
                  </>
                )}
                <div className="post-info">
                  <h2 className="user-name">
                    {`${userInfo.first_name} ${userInfo.last_name}`}
                  </h2>
                  <h4 className="post-title">{post.title}</h4>
                  <p className="post-description">{post.description}</p>
                </div>
              </div>
              {/* Comments Section */}
              <div className="comments-section">
                <CommentsList postId={postId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
}

// export default function PostDetail() {
//   const dispatch = useDispatch();
//   const history = useHistory();
//   const { postId } = useParams();
//   console.log("🚀 ~ file: index.js:56 ~ PostDetail ~ postId:", postId)

//   const sessionUser = useSelector(selectSessionUser);
//   const post = useSelector(selectSinglePost);
//   const userInfo = post?.user_info;
//   const neighborPosts = useSelector(selectNeighborPosts);
//   const loading = useSelector(selectLoading);
//   const userId = post?.owner_id;

//   const favorite = useSelector((state) => isPostFavorited(state, postId));
//   console.log("🚀 ~ file: index.js:66 ~ PostDetail ~ favorite:", favorite);

//   const handleFavoriteToggle = async (e) => {
//     e.stopPropagation();
//     if (userId) {
//       await dispatch(thunkToggleFavorite(userId, postId));
//       await fetchData();
//     }
//   };

//   const fetchData = useCallback(async () => {
//     try {
//       dispatch(setLoading(true));
//       const promises = [dispatch(thunkGetPostDetails(postId))];

//       if (userId !== undefined) {
//         promises.push(dispatch(thunkGetNeighborPosts(postId, userId)));
//       }

//       await Promise.all(promises);
//     } catch (err) {
//       dispatch(setError("An error occurred"));
//     } finally {
//       dispatch(setLoading(false));
//     }
//   }, [dispatch, postId, userId]);

//   useEffect(() => {
//     dispatch(clearPostDetails());
//     dispatch(clearUIState());
//   }, [dispatch, postId]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   if (loading && (!post || !post.image_url)) return <Spinner />;
//   if (!post || !post.image_url) return null;
//   return (
//     <CSSTransition
//       in={!!post}
//       timeout={300}
//       classNames="post-transition"
//       unmountOnExit
//     >
//       <div className="post-detail-container">
//         <div className="post-main-content-container">
//           <div className="post-detail-top-container">
//             {/* Image Container */}
//             <div className="image-container">
//               <LazyLoadImage
//                 src={post.image_url}
//                 alt={post.title}
//                 effect="blur"
//                 className="displayed-image"
//               />

//               {/* Navigation Buttons */}
//               {neighborPosts.prevPostId && (
//                 <button
//                   className="prev-button"
//                   onClick={() =>
//                     history.push(`/posts/${neighborPosts.prevPostId}`)
//                   }
//                 >
//                   <FontAwesomeIcon icon={faChevronLeft} />
//                 </button>
//               )}
//               {neighborPosts.nextPostId && (
//                 <button
//                   className="next-button"
//                   onClick={() =>
//                     history.push(`/posts/${neighborPosts.nextPostId}`)
//                   }
//                 >
//                   <FontAwesomeIcon icon={faChevronRight} />
//                 </button>
//               )}
//             </div>

//             {/* Edit and Delete Buttons */}
//             {sessionUser && sessionUser.id === post.owner_id && (
//               <div className="edit-delete-post-btn">
//                 <OpenShortModalButton
//                   className="edit-post-button"
//                   buttonText={<FontAwesomeIcon icon={faSliders} />}
//                   modalComponent={
//                     <EditPostForm
//                       postId={postId}
//                       fetchPostDetailDat={fetchData}
//                     />
//                   }
//                 />
//                 <OpenShortModalButton
//                   className="delete-post-button"
//                   buttonText={<FontAwesomeIcon icon={faTrash} />}
//                   modalComponent={
//                     <DeletePost
//                       postId={postId}
//                       onDelete={() => {
//                         if (neighborPosts.prevPostId) {
//                           history.push(`/posts/${neighborPosts.prevPostId}`);
//                         } else {
//                           history.push("/owner/photostream");
//                         }
//                       }}
//                     />
//                   }
//                 />
//               </div>
//             )}
//             <button onClick={handleFavoriteToggle} className="favorite-button">
//               <FontAwesomeIcon
//                 icon={favorite ? solidStar : regularStar}
//                 className="favorite-icon"
//               />
//             </button>
//           </div>
//           {/* User and Post Information */}
//           <div className="post-detail-bottom-container">
//             <div className="details-comments-container">
//               <div className="user-post-info">
//                 {userInfo && (
//                   <>
//                     <img
//                       src={userInfo.profile_picture}
//                       alt={`${userInfo.first_name} ${userInfo.last_name}`}
//                       className="user-profile-picture"
//                     />
//                   </>
//                 )}
//                 <div className="post-info">
//                   <h2 className="user-name">
//                     {`${userInfo.first_name} ${userInfo.last_name}`}
//                   </h2>
//                   <h4 className="post-title">{post.title}</h4>
//                   <p className="post-description">{post.description}</p>
//                 </div>
//               </div>

//               {/* Comments Section */}
//               <div className="comments-section">
//                 <CommentsList postId={postId} />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </CSSTransition>
//   );
// }
