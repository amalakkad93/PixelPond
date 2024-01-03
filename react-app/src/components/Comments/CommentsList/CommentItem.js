import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectSessionUser } from "../../../store/selectors";
import EditCommentForm from "../CommentForm/EditCommentForm";
import OpenModalButton from "../../Modals/OpenModalButton";
import OpenShortModalButton from "../../Modals/OpenShortModalButton";
import DeleteComment from "../DeleteComment";
import "./CommentItem.css";

const CommentItem = ({
  comment,
  sessionUser,
  showOptionsFor,
  setShowOptionsFor,
  fetchComments,
  postId,
}) => {
  const userFirstName = comment.user_info?.first_name ?? "Anonymous";
  const userLastName = comment.user_info?.last_name ?? "";
  const userName = `${userFirstName} ${userLastName}`;
  const image = comment?.image_url;

  return (
    <div className="comment-item">
      <div className="comment-user-profile">
      {/* <div className="comment-user-profile"> */}

        <div className="comment-user-profile-picture-div">
          {comment?.user_info?.profile_picture ? (
            <img
              src={comment?.user_info.profile_picture}
              alt={`${comment?.user_info.first_name} ${comment?.user_info?.last_name}`}
              className="comment-user-profile-picture"
            />
          ) : (
            <i className="fas fa-user icon" aria-hidden="true"></i>
          )}
        </div>
        <div className="comment-user-name-date-comment-text">
          <div className="comment-user-name-date-edit">
            <div className="comment-user-name-date">
              <div className="comment-user-name-date">
                <p className="comment-user-name">{userName}</p>
                <p className="comment-date">{comment.created_at_display}</p>
              </div>
            </div>
            <div className="comment-edit-delete-div">
              {sessionUser && sessionUser.id === comment.user_id && (
                <div className="comment-actions">
                  <i
                    className="fas fa-ellipsis-h"
                    onClick={() =>
                      setShowOptionsFor(
                        showOptionsFor === comment.id ? null : comment.id
                      )
                    }
                  ></i>
                  {showOptionsFor === comment.id && (
                    <div className="options-modal">
                      <OpenShortModalButton
                        className="edit-comment-button"
                        buttonText={
                          <i className="fas fa-edit" aria-hidden="true"></i>
                        }
                        modalComponent={
                          <EditCommentForm
                            commentId={comment.id}
                            postId={comment.post_id}
                            onCommentSuccess={() => {
                              fetchComments(1);
                              setShowOptionsFor(null);
                            }}
                          />
                        }
                      />
                      <OpenShortModalButton
                        className="delete-modal"
                        buttonText={
                          <i className="fas fa-trash" aria-hidden="true"></i>
                        }
                        modalComponent={
                          <DeleteComment
                            postId={postId}
                            commentId={comment.id}
                            onDelete={() => {
                              fetchComments(1);
                              setShowOptionsFor(null);
                            }}
                          />
                        }
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="comment-text">
            <p className="comment-text-p-tag">{comment?.comment}</p>
          </div>
          <div className="comment-content">
          {/* <p>{comment?.comment}</p> */}
          {image && <img className="comment-img" src={image} alt="Comment" />}
        </div>
        </div>
      </div>

      <div className="comment-text-area">
        <div className="comment-content">
          {/* <p>{comment?.comment}</p> */}
          {/* {image && <img className="comment-img" src={image} alt="Comment" />} */}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
