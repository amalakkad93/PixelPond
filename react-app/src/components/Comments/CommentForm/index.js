import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { useModal } from "../../../context/Modal";
import { useShortModal } from "../../../context/ModalShort";
import {
  thunkAddComment,
  thunkEditComment,
  thunkGetCommentDetail,
} from "../../../store/comments";
import { selectSessionUser } from "../../../store/selectors";
import AWSImageUploader from "../../Aws/AWSImageUploader";
import OpenModalButton from "../../Modals/OpenModalButton";
import SignupFormModal from "../../SignupFormModal";
import "./CommentForm.css";

export default function CommentForm({
  postId,
  formType,
  commentId,
  onCommentPost,
  onCommentSuccess,
}) {
  const dispatch = useDispatch();
  const history = useHistory();

  const { closeShortModal } = useShortModal();
  const [content, setContent] = useState("");
  const [uploadImage, setUploadImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sessionUser = useSelector(selectSessionUser);
  const profilePic = sessionUser?.profile_picture;

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
