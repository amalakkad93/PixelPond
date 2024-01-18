/**
 * CommentForm Component
 *
 * This component is a form for creating and editing comments on posts. It allows users to add textual content
 * and optionally an image to their comment. The form supports two modes: 'Create' for adding new comments and
 * 'Edit' for modifying existing ones. It uses Redux for dispatching actions related to comments and integrates
 * with a modal control context. The component also fetches comment details for editing and integrates an image
 * uploader for adding images to comments.
 *
 * @param {number} postId - The ID of the post to which the comment is related.
 * @param {string} formType - The type of form, either 'Create' or 'Edit'.
 * @param {number} [commentId] - The ID of the comment being edited (required for 'Edit' formType).
 * @param {function} [onCommentSuccess] - Callback function executed after successful comment submission.
 */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, } from "@fortawesome/free-solid-svg-icons";
import { useShortModal } from "../../../context/ModalShort";
import {
  thunkAddComment,
  thunkEditComment,
  thunkGetCommentDetail,
} from "../../../store/comments";
import { selectSessionUser } from "../../../store/selectors";
import AWSImageUploader from "../../Aws/AWSImageUploader";

import "./CommentForm.css";

export default function CommentForm({
  postId,
  formType,
  commentId,
  onCommentPost,
  onCommentSuccess,
}) {
  const dispatch = useDispatch();

  // Setup of hooks and state management variables
  const { closeShortModal } = useShortModal();
  const [content, setContent] = useState("");
  const [uploadImage, setUploadImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sessionUser = useSelector(selectSessionUser);
  const profilePic = sessionUser?.profile_picture;

  // useEffect hook to fetch and set comment data for editing
  useEffect(() => {
    const fetchAndSetCommentData = async () => {
      if (sessionUser && formType === "Edit" && postId && commentId) {
        try {
          const fetchedComment = await dispatch(
            thunkGetCommentDetail(postId, commentId)
          );
          if (fetchedComment) {
            setContent(fetchedComment.comment);
            setExistingImageUrl(fetchedComment.image_url);
          }
        } catch (error) {
          console.error("Error fetching comment details: ", error);
        }
      }
    };

    fetchAndSetCommentData();
  }, [dispatch, postId, commentId, sessionUser, formType]);

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let uploadedImageUrl = null;
    if (uploadImage) {
      uploadedImageUrl = await uploadImage();
    }

    const commentData = {
      comment: content,
      image_url: uploadedImageUrl || existingImageUrl,
    };

    try {
      if (formType === "Create") {
        await dispatch(thunkAddComment(postId, commentData));
        if (onCommentSuccess) {
          onCommentSuccess();
        }
      } else if (formType === "Edit") {
        const response = await dispatch(
          thunkEditComment(postId, commentId, commentData)
        );
        if (response) {
          if (onCommentSuccess) {
            onCommentSuccess();
          }
          closeShortModal();
        }
      }
    } catch (error) {
      console.error("Error submitting comment: ", error);
    } finally {
      setContent("");
      setUploadImage(null);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-area">
       {/* Display user profile picture or default icon */}
      {formType === "Create" && (
        <div className="comment-user-profile-picture">
          {profilePic ? (
            <img
              src={profilePic}
              alt="User Profile"
              className="comment-profile-picture"
            />
          ) : (
            <FontAwesomeIcon
              icon={faUserCircle}
              className="comment-default-profile-icon"
            />
          )}
        </div>
      )}
      <div className="text-area-section">
        <form onSubmit={handleSubmit} className="comment-form">
          {/* Textarea for comment and AWSImageUploader component */}
          <div className="text-area-wrapper">
            <textarea
              className="comment-field"
              placeholder=" Add a comment about this photo"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>

            <AWSImageUploader
              className="aws-image-uploader"
              setUploadImage={setUploadImage}
            />
            {formType === "Create" && <div className="comment-arrow"></div>}
          </div>
          {/* Submit button for the form */}
          <button
            type="submit"
            className={`action comment-button ${
              formType === "Edit" ? "comment-edit-btn" : "comment-create-btn"
            }`}
          >
            {formType === "Create" ? "Add comment" : "Update comment"}
          </button>
        </form>
      </div>
    </div>
  );
}
