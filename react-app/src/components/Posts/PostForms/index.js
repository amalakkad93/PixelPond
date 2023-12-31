import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreatableSelect from "react-select/creatable";

// import CreatableSelect from "react-select/creatable";

import { useModal } from "../../../context/Modal";
import { useShortModal } from "../../../context/ModalShort";
import {
  uploadImageToAWS,
  createInputChangeHandler,
} from "../../../assets/helpers/helpers";
import {
  thunkCreatePost,
  thunkUpdatePost,
  thunkGetPostDetails,
} from "../../../store/posts";
import { thunkGetAllTags } from "../../../store/tags";
import { selectSessionUser, selectAllTags } from "../../../store/selectors";

import AWSImageUploader from "../../Aws/AWSImageUploader";
import TagSelector from "../../Tags/TagSelector";

import "./PostForm.css";
import "./Tag.css";

const PostForm = ({ postId, formType, onPostCreated, fetchPostDetailData }) => {
  const dispatch = useDispatch();
  const { closeShortModal } = useShortModal();
  const hiddenFileInput = useRef(null);

  const sessionUser = useSelector(selectSessionUser);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [validationObj, setValidationObj] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchAndSetPostData = async () => {
      if (sessionUser && formType === "Edit" && postId) {
        try {
          const fetchedPost = await dispatch(thunkGetPostDetails(postId));
          console.log("===fetchAndSetPostData ~ fetchedPost:", fetchedPost);
          if (fetchedPost) {
            setTitle(fetchedPost.title);
            setDescription(fetchedPost.description);
            setImageFile(fetchedPost.image_url);
            // Update here to set the existing tags in selectedTags
            const existingTags = fetchedPost.tags.map((tag) => ({
              value: tag.name,
              label: tag.name,
            }));
            setSelectedTags(existingTags);
          }
        } catch (error) {
          console.error("Error fetching post details: ", error);
        }
      }
    };

    fetchAndSetPostData();
  }, [dispatch, postId, sessionUser, formType]);

  useEffect(() => {
    const fetchTags = async () => {
      const fetchedTags = await dispatch(thunkGetAllTags());
      const formattedTags = fetchedTags.map((tag) => ({
        value: tag,
        label: tag,
      }));
      setAvailableTags(formattedTags);
    };
    fetchTags();
  }, [dispatch]);

  const handleInputChange = (setterFunction, validationField) => (e) => {
    setterFunction(e.target.value);

    // Clear Validation Error
    setValidationObj((prev) => {
      const newObj = { ...prev };
      delete newObj[validationField];
      return newObj;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const errorsObj = {};

    if (!title) errorsObj.title = "Title is required";
    if (title.length > 100)
      errorsObj.title = "Title must have fewer than 100 characters";

    if (!description) errorsObj.description = "Description is required";
    if (description.length > 1000)
      errorsObj.description = "Description is too long";

    if (formType === "Create" && !imageFile) {
      errorsObj.image = "An image must be uploaded";
    }

    if (Object.keys(errorsObj).length > 0) {
      setValidationObj(errorsObj);
      setIsSubmitting(false);
      return;
    }

    try {
      const postData = {
        title,
        description,
        tags: selectedTags.map((tag) => tag.value),
      };

      let imageToUpdate = null;
      if (imageFile instanceof File) {
        imageToUpdate = imageFile;
      }

      let response;
      if (formType === "Create") {
        response = await dispatch(thunkCreatePost(postData, imageFile));
      }
      console.log(
        "===image file before dispatching the thunkUpdatePost:",
        imageFile
      );
      if (formType === "Edit") {
        const onUploadProgress = (progress) => {
          setUploadProgress(progress);
          if (progress === 100) {
            setTimeout(() => setUploadProgress(0), 2000);
          }
        };
        response = await dispatch(
          thunkUpdatePost(postId, postData, imageToUpdate, onUploadProgress)
        );
      }

      if (response && response.id) {
        resetFormFields();
        closeShortModal();
        if (onPostCreated) onPostCreated(response);
      } else {
        console.error("Invalid response:", response);
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
    setImageFile(null);
    setTags([]);
    setUploadError(null);
    setIsUploading(false);
  };

  console.log("===image file state before the return jsx:", imageFile);
  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <TagSelector
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          availableTags={availableTags}
        />
      </div>

      <div className="form-group">
        <input
          className="form-control"
          type="text"
          value={title}
          onChange={handleInputChange(setTitle, "title")}
          placeholder="Title"
        />
        <div className="error-container">
          {validationObj.title && (
            <p className="errors">{validationObj.title}</p>
          )}
        </div>
      </div>

      <div className="form-group">
        <textarea
          className="form-textarea"
          value={description}
          onChange={handleInputChange(setDescription, "description")}
          placeholder="Description"
        />
        <div className="error-container">
          {validationObj.description && (
            <p className="errors">{validationObj.description}</p>
          )}
        </div>
      </div>

      <div className="form-group">
        <button
          type="button"
          className="post-form-custom-file-upload"
          onClick={() => hiddenFileInput.current.click()}
        >
          Upload photos
        </button>

        <input
          id="file-upload"
          type="file"
          className="post-form-file-upload"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setImageFile(file);
              const previewURL = URL.createObjectURL(file);
              setProfilePicPreview(previewURL);
            } else {
              setProfilePicPreview(null);
            }
          }}
          ref={hiddenFileInput}
          style={{ display: "none" }}
          accept="image/*"
        />
        <div className="error-container">
          {validationObj.imageFile && (
            <p className="errors">{validationObj.imageFile}</p>
          )}
        </div>
        <div className="image-preview">
          {profilePicPreview ? (
            <img src={profilePicPreview} alt="Profile Preview" />
          ) : (
            <p>No image selected</p>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="post-form-submit-button"
        disabled={
          title.trim() === "" ||
          description.trim() === "" ||
          isSubmitting ||
          Object.keys(validationObj).length > 0
        }
      >
        {formType === "Create" ? "Create Post" : "Update Post"}
      </button>

      {/* {isSubmitting && (
        <div className="progress-bar-container">
          <div className="progress-bar"></div>
        </div>
      )} */}
      {uploadProgress > 0 && (
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${uploadProgress}%` }}>
            {uploadProgress}%
          </div>
        </div>
      )}
    </form>
  );
};

export default PostForm;

// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import CreatableSelect from "react-select/creatable";

// import { useModal } from "../../../context/Modal";
// import {
//   uploadImageToAWS,
//   createInputChangeHandler,
// } from "../../../assets/helpers/helpers";
// import {
//   thunkCreatePost,
//   thunkUpdatePost,
//   thunkGetPostDetails,
// } from "../../../store/posts";
// import { thunkGetAllTags } from "../../../store/tags";
// import { selectSessionUser, selectAllTags } from "../../../store/selectors";

// import AWSImageUploader from "../../Aws/AWSImageUploader";

// import "./PostForm.css";
// import "./Tag.css";

// const PostForm = ({ postId, formType, onPostCreated, fetchPostDetailData }) => {
//   const dispatch = useDispatch();
//   const { closeModal } = useModal();
//   const sessionUser = useSelector(selectSessionUser);

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [uploadError, setUploadError] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [file, setFile] = useState(null);
//   const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
//   const [tags, setTags] = useState([]);
//   const [selectedTags, setSelectedTags] = useState([]);
//   const [availableTags, setAvailableTags] = useState([]);
//   const [isImageUploaded, setIsImageUploaded] = useState(false);

//   const [uploadFunction, setUploadFunction] = useState(null);

//   const [uploadImage, setUploadImage] = useState(null);

//   const [selectedFile, setSelectedFile] = useState(null);
//   const [validationObj, setValidationObj] = useState({});
//   const [imageError, setImageError] = useState("");

//   useEffect(() => {
//     const fetchAndSetPostData = async () => {
//       if (sessionUser && formType === "Edit" && postId) {
//         try {
//           const fetchedPost = await dispatch(thunkGetPostDetails(postId));
//           if (fetchedPost) {
//             setTitle(fetchedPost.title);
//             setDescription(fetchedPost.description);
//             setUploadedImageUrl(fetchedPost.image);

//             setTags(fetchedPost.tags.map((tag) => tag.name));
//           }
//         } catch (error) {
//           console.error("Error fetching post details: ", error);
//         }
//       }
//     };

//     fetchAndSetPostData();
//   }, [dispatch, postId, sessionUser, formType]);

//   useEffect(() => {
//     const fetchTags = async () => {
//       const fetchedTags = await dispatch(thunkGetAllTags());
//       const formattedTags = fetchedTags.map((tag) => ({
//         value: tag,
//         label: tag,
//       }));
//       setAvailableTags(formattedTags);
//     };
//     fetchTags();
//   }, [dispatch]);

//   const handleInputChange = (setterFunction, validationField) => (e) => {
//     setterFunction(e.target.value);

//     // Clear Validation Error
//     setValidationObj((prev) => {
//       const newObj = { ...prev };
//       delete newObj[validationField];
//       return newObj;
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     const errorsObj = {};

//     if (!title) errorsObj.title = "Title is required";
//     if (title.length > 100)
//       errorsObj.title = "Title must have fewer than 100 characters";

//     if (!description) errorsObj.description = "Description is required";
//     if (description.length > 1000)
//       errorsObj.description = "Description is too long";

//     if (!isImageUploaded) {
//       errorsObj.image = "An image must be uploaded";
//     }

//     if (Object.keys(errorsObj).length > 0) {
//       setValidationObj(errorsObj);
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       let uploadedImageUrl = null;
//       if (uploadImage) {
//         uploadedImageUrl = await uploadImage();
//       }

//       const postData = {
//         title,
//         description,
//         image_url: uploadedImageUrl,
//         tags: selectedTags.map((tag) => tag.value),
//       };

//       let response;
//       if (formType === "Create") {
//         response = await dispatch(thunkCreatePost(postData));
//       } else {
//         response = await dispatch(thunkUpdatePost(postId, postData));
//       }

//       if (response && response.data && response.data.id) {
//         resetFormFields();
//         closeModal();
//         if (onPostCreated) onPostCreated(response.data);
//       } else {
//         throw new Error("Failed to create/update post.");
//       }
//     } catch (error) {
//       console.error("Error in handleSubmit: ", error);
//       setUploadError(error.message || "An unexpected error occurred");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const resetFormFields = () => {
//     setTitle("");
//     setDescription("");
//     setUploadedImageUrl(null);
//     setTags([]);
//     setUploadError(null);
//     setIsUploading(false);
//   };

//   console.log("Uploaded Image URL:", uploadedImageUrl);

//   return (
//     <form className="post-form" onSubmit={handleSubmit}>
//       <div className="form-group">
//         <div className="form-group">
//           <CreatableSelect
//             className="my-select"
//             isMulti
//             onChange={setSelectedTags}
//             value={selectedTags}
//             options={availableTags}
//             placeholder="Select or create tags"
//           />
//         </div>
//       </div>

//       <div className="form-group">
//         <input
//           className="form-control"
//           type="text"
//           value={title}
//           onChange={handleInputChange(setTitle, "title")}
//           placeholder="Title"
//         />
//         <div className="error-container">
//           {validationObj.title && (
//             <p className="errors">{validationObj.title}</p>
//           )}
//         </div>
//       </div>

//       <div className="form-group">
//         <textarea
//           className="form-textarea"
//           value={description}
//           onChange={handleInputChange(setDescription, "description")}
//           placeholder="Description"
//         />
//         <div className="error-container">
//           {validationObj.description && (
//             <p className="errors">{validationObj.description}</p>
//           )}
//         </div>
//       </div>

//       <div className="form-group">
//         <AWSImageUploader
//           setUploadImage={setUploadImage}
//           setImageError={setImageError}
//           onUploadSuccess={setIsImageUploaded}
//         />

//         {imageError && <div className="error-message">{imageError}</div>}
//         {uploadError && <div className="error-message">{uploadError}</div>}
//       </div>
//       <button
//         type="submit"
//         disabled={
//           title.trim() === "" ||
//           description.trim() === "" ||
//           !isImageUploaded ||
//           isSubmitting ||
//           Object.keys(validationObj).length > 0
//         }
//       >
//         {formType === "Create" ? "Create Post" : "Update Post"}
//       </button>

//       {isSubmitting && (
//         <div className="progress-bar-container">
//           <div className="progress-bar"></div>
//         </div>
//       )}
//     </form>
//   );
// };

// export default PostForm;
