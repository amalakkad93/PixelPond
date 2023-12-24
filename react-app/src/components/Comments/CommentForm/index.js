import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../../context/Modal";
import { thunkAddComment, thunkEditComment, thunkGetCommentDetail } from "../../../store/comments";
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
  const { closeModal } = useModal();
  const [content, setContent] = useState("");
  const [uploadImage, setUploadImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sessionUser = useSelector(selectSessionUser);

  useEffect(() => {
    const fetchAndSetCommentData = async () => {
      if (sessionUser && formType === "Edit" && postId && commentId) {
        try {

          const fetchedComment = await dispatch(thunkGetCommentDetail(postId, commentId));
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

    const commentData = { comment: content, image_url: uploadedImageUrl || existingImageUrl };

    try {
      if (formType === "Create") {
        await dispatch(thunkAddComment(postId, commentData));
        if (onCommentSuccess) {
          onCommentSuccess();
        }
      } else if (formType === "Edit") {
        const response = await dispatch(thunkEditComment(postId, commentId, commentData));
        if (response) {
          if (onCommentSuccess) {
            onCommentSuccess();
          }
          closeModal();
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
    <div className="comment-form-container">
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
        />
        <AWSImageUploader className="aws-image-uploader" setUploadImage={setUploadImage} />
        <button className="comment-create-edit-btn" type="submit" disabled={isSubmitting}>
          {formType === "Create" ? "Post Comment" : "Update Comment"}
        </button>
      </form>
    </div>
  );
}
