import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectSessionUser } from "../../../store/selectors";
import EditCommentForm from "../CommentForm/EditCommentForm";
import OpenModalButton from "../../Modals/OpenModalButton";
import "./CommentItem.css";

const CommentItem = ({ comment }) => {

  const userFirstName = comment.user_info?.first_name ?? "Anonymous";
  const userLastName = comment.user_info?.last_name ?? "";
  const userName = `${userFirstName} ${userLastName}`;
  const image = comment?.image_url;

  return (
    <div className="comment-item">
      <div className="comment-user-profile">
        <div className="comment-user-profile">
          {comment?.user_info?.profile_picture ? (
            <img
              src={comment?.user_info.profile_picture}
              alt={`${comment?.user_info.first_name} ${comment?.user_info?.last_name}`}
              className="comment-user-profile-picture"
            />
          ) : (
            <i className="fas fa-user icon" aria-hidden="true"></i>
          )}
          <div className="comment-user-name-date">
            <p className="comment-user-name">{`${userName}`}</p>
            <p className="comment-date">{comment.created_at_display}</p>
          </div>
        </div>
      </div>

      <div className="comment-text-area">
        <div className="comment-content">
          <p>{comment?.comment}</p>
          {image && <img className="comment-img" src={image} alt="Comment" />}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
