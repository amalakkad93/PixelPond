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
  const uploadedImageUrl = useSelector(selectUploadedImageUrl);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAndSetPostData = async () => {
      if (sessionUser && formType === "Edit") {
        const fetchedPost = await dispatch(thunkGetPostDetails(postId));
        if (formType === "Edit" && fetchedPost) {
          setTitle(fetchedPost.title);
          setDescription(fetchedPost.description);
          dispatch(setUploadedImageUrl(fetchedPost.image));
        }
      }
    };

    fetchAndSetPostData();
  }, [dispatch, postId, sessionUser, formType]);


  const createOrUpdatePost = async (imageUrl) => {
    setIsSubmitting(true);
    const finalImageUrl = imageUrl || uploadedImageUrl;
    const postData = { title, description, image_url: finalImageUrl };
    try {
      let postResponse;
      if (formType === "Create") {
        postResponse = await dispatch(thunkCreatePost(postData));
      } else if (formType === "Edit") {
        postResponse = await dispatch(thunkUpdatePost(postId, postData));
      }

      if (postResponse && postResponse.type === "SUCCESS") {
        resetFormFields();
        closeModal();
      } else {
        setUploadError("Failed to create/update post");
      }
    } catch (error) {
      setUploadError("An error occurred");
      console.error(error);
    }
    setIsSubmitting(false);
  };

  const resetFormFields = () => {
    setTitle("");
    setDescription("");
    dispatch(setUploadedImageUrl(""));
    setUploadError(null);
    setIsUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formType === "Create" && !uploadedImageUrl) {
        setUploadError("Please upload an image first.");
        return;
      }
      await createOrUpdatePost(uploadedImageUrl);
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
        <AWSImageUploader
          onUploadSuccess={(newImageUrl) => dispatch(setUploadedImageUrl(newImageUrl))}
          onUploadFailure={(errorMessage) => setUploadError(errorMessage)}
          initiateUpload={isUploading}
        />
      </div>

      {uploadError && <div className="upload-error">{uploadError}</div>}
      <button className="submit-button" type="submit" disabled={isSubmitting}>
        {formType === "Create" ? "Create Post" : "Update Post"}
      </button>

      {isSubmitting && <div className="progress-bar-container">
        <div className="progress-bar"></div>
      </div>}
    </form>
  );
};

export default PostForm;
