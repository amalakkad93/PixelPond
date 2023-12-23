import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import {
  thunkCreatePost,
  thunkUpdatePost,
  thunkGetPostsByUserId,
  thunkGetPostDetails,
} from "../../../store/posts";
import { setUploadedImageUrl, deleteImage } from "../../../store/aws";
import { setLoading, setError, clearUIState } from "../../../store/ui";

import AWSImageUploader from "../../Aws/AWSImageUploader";
import {
  selectPostById,
  selectUserAlbums,
  selectSessionUser,
  selectUploadedImageUrl,
  selectCurrentPage,
} from "../../../store/selectors";

import "./PostForm.css";

const PostForm = ({ postId, formType, onPostCreated, fetchPostDetailData }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const existingPost = useSelector((state) => selectPostById(state, postId));
  const currentPage = useSelector(selectCurrentPage);
  const userAlbums = useSelector(selectUserAlbums);
  const sessionUser = useSelector(selectSessionUser);
  // const uploadedImageUrl = useSelector(selectUploadedImageUrl);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const [uploadImage, setUploadImage] = useState(null);



      useEffect(() => {
        const fetchAndSetPostData = async () => {
          if (sessionUser && formType === "Edit" && postId) {
            try {
              const fetchedPost = await dispatch(thunkGetPostDetails(postId));
              if (fetchedPost) {
                setTitle(fetchedPost.title);
                setDescription(fetchedPost.description);
                setUploadedImageUrl(fetchedPost.image);
              }
            } catch (error) {
              console.error("Error fetching post details: ", error);
            }
          }
        };

        fetchAndSetPostData();
      }, [dispatch, postId, sessionUser, formType]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let uploadedImageUrl = null;
      if (uploadImage) {
        uploadedImageUrl = await uploadImage();
      }

      const postData = { title, description, image_url: uploadedImageUrl };
      let response;
      if (formType === "Create") {
        response = await dispatch(thunkCreatePost(postData));
      } else {
        response = await dispatch(thunkUpdatePost(postId, postData));
      }

      if (response && response.data && response.data.id) {
        resetFormFields();
        closeModal();
        if (onPostCreated) onPostCreated(response.data);
      } else {
        throw new Error("Failed to create/update post.");
      }
    } catch (error) {
      console.error("Error in handleSubmit: ", error);
      setUploadError(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFormFields = () => {
    setTitle("");
    setDescription("");
    setUploadedImageUrl(null);
    setUploadError(null);
    setIsUploading(false);
  };


  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          className="form-control"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
      </div>

      <div className="form-group">
        <textarea
          className="form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        ></textarea>
      </div>

        <div className="form-group">
        <AWSImageUploader setUploadImage={setUploadImage} />
      </div>
      {uploadError && <div className="error-message">{uploadError}</div>}
      <button type="submit" disabled={isSubmitting}>
      {/* <button type="submit" > */}
        {formType === "Create" ? "Create Post" : "Update Post"}
      </button>

      {isSubmitting && <div className="progress-bar-container">
        <div className="progress-bar"></div>
      </div>}
    </form>
  );
};

export default PostForm;
