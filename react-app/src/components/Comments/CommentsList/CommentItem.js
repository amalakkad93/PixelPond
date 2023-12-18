import React from 'react';
import "./CommentsList.css";

const CommentItem = ({ comment }) => {
  const userFirstName = comment.user_info?.first_name ?? "Anonymous";
  const userLastName = comment.user_info?.last_name ?? "";
  const userName = `${userFirstName} ${userLastName}`;
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
</div>

      </div>
      <div className="comment-text-area">
        <div className="comment-user-name-date">
          <p className="comment-user-name">{`${userName}`}</p>
          <p className="comment-date">{comment.created_at_display}</p>
        </div>
        <div className="comment-content">
          <p>{comment?.comment}</p>
        </div>
      </div>
    </div>
  );
};


export default CommentItem;
