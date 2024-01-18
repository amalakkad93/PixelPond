/**
 * CommentItem Component
 *
 * This component represents an individual comment item in the comments list. It displays the user's
 * profile picture, name, comment text, and the date of the comment. It also includes options for editing
 * or deleting the comment if the session user is the author of the comment. The component integrates
 * modals for editing and deleting comments.
 *
 * @param {Object} comment - The comment object containing details to be displayed.
 * @param {Object} sessionUser - The current session user's details.
 * @param {number} showOptionsFor - ID of the comment for which options are being shown.
 * @param {function} setShowOptionsFor - Function to set the ID for showing options.
 * @param {function} fetchComments - Function to fetch comments (used for updating the list after actions).
 * @param {number} postId - The ID of the post to which the comment belongs.
 */
import React from "react";
import EditCommentForm from "../CommentForm/EditCommentForm";
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
  // Definition of variables for comment user's name and image
  const userFirstName = comment.user_info?.first_name ?? "Anonymous";
  const userLastName = comment.user_info?.last_name ?? "";
  const userName = `${userFirstName} ${userLastName}`;
  const image = comment?.image_url;

  return (
    <div className="comment-item">
      {/* Display user profile and comment details */}
      <div className="comment-user-profile">
        <div className="comment-user-profile-picture-div">
          {comment?.user_info?.profile_picture ? (
            <img
              src={comment?.user_info?.profile_picture}
              alt={`${comment?.user_info?.first_name} ${comment?.user_info?.last_name}`}
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
                <p className="comment-date">{comment?.created_at_display}</p>
              </div>
            </div>
            <div className="comment-edit-delete-div">
              {sessionUser && sessionUser?.id === comment?.user_id && (
                <div className="comment-actions">
                  <i
                    className="fas fa-ellipsis-h"
                    onClick={() =>
                      setShowOptionsFor(
                        showOptionsFor === comment?.id ? null : comment?.id
                      )
                    }
                  ></i>
                  {/* Conditional rendering for edit and delete options */}
                  {showOptionsFor === comment?.id && (
                    <div className="comments-options-modal">
                      <OpenShortModalButton
                        className="edit-comment-button"
                        buttonText={
                          <i className="fas fa-edit" aria-hidden="true"></i>
                        }
                        modalComponent={
                          <EditCommentForm
                            commentId={comment?.id}
                            postId={comment?.post_id}
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
                            commentId={comment?.id}
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
          {image && <img className="comment-img" src={image} alt="Comment" />}
        </div>
        </div>
      </div>

      <div className="comment-text-area">
        <div className="comment-content">
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
