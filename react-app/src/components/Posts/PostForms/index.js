import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import {
  thunkCreatePost,
  thunkUpdatePost,
  thunkGetPostsByUserId,
  thunkGetPostDetails
} from "../../../store/posts";
import { setUploadedImageUrl, deleteImage } from "../../../store/aws";
import { setLoading, setError, clearUIState } from "../../../store/ui";

import AWSImageUploader from "../../Aws/AWSImageUploader";
import {
  selectPostById,
  selectUserAlbums,
  selectSessionUser,
  selectUploadedImageUrl,
} from "../../../store/selectors";

import "./PostForm.css";

const PostForm = ({ postId, formType, onPostCreated, currentPage, fetchPostDetailData }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const existingPost = useSelector((state) => selectPostById(state, postId));

  const userAlbums = useSelector(selectUserAlbums);
  const sessionUser = useSelector(selectSessionUser);
  const uploadedImageUrl = useSelector(selectUploadedImageUrl);
  console.log("🚀 PostForm ~ uploadedImageUrl :", uploadedImageUrl);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadError, setUploadError] = useState(null);
  const [file, setFile] = useState(null);
  const [triggerUpload, setTriggerUpload] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchAndSetPostData = async () => {
      if (sessionUser) {
        const fetchedPost = await dispatch(thunkGetPostDetails(postId))
        if (formType === "Edit" && fetchedPost) {
          setTitle(fetchedPost.title);
          setDescription(fetchedPost.description);
          dispatch(setUploadedImageUrl(fetchedPost.image));
          // let img = dispatch(setUploadedImageUrl(fetchedPost.image));


        }
      }
    };

    fetchAndSetPostData();
  }, [dispatch, postId, sessionUser, formType]);


  const createOrUpdatePost = async (imageUrl) => {
    const imageUrlToUse = imageUrl || uploadedImageUrl;
    if (!imageUrl) {
      setUploadError("No image URL available for the post");
      return;
    }

    const postData = { title, description, image_url: imageUrlToUse};
    try {
      let postResponse;
      if (formType === "Create") {
        postResponse = await dispatch(thunkCreatePost(postData));
      } else if (formType === "Edit") {
        postResponse = await dispatch(thunkUpdatePost(postId, postData));
      }

      if (postResponse && postResponse.type === "SUCCESS") {
        // Handle successful post creation/update
        // Reset form fields, close modal, etc.
        setTitle("");
        setDescription("");
        dispatch(setUploadedImageUrl(""));
        setUploadError(null);
        setIsUploading(false);
        closeModal();
        // If a new post was created, update the posts list
        if (formType === "Create") {
          dispatch(thunkGetPostsByUserId(sessionUser.id, currentPage, 10));
        }
        if (formType === "Edit") {
          dispatch(thunkGetPostDetails(postId))
        }
      } else {
        // Handle case where response does not indicate success
        setUploadError("Failed to create/update post");
        console.log("Post response error:", postResponse);
      }
    } catch (error) {
      setUploadError("An error occurred during post creation/update");
      console.error("Post creation/update error:", error);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting with image URL:", uploadedImageUrl);
    const postCreationResponse = await createOrUpdatePost(uploadedImageUrl);


    // if (postCreationResponse && postCreationResponse.type === "SUCCESS") {
    //   // Dispatch the thunk to get updated posts after successful post creation
    //   dispatch(thunkGetPostsByUserId(sessionUser.id, currentPage, 10));
    // } else {
    //   // Handle the case where post creation was not successful
    //   console.error("Post creation failed:", postCreationResponse);
    // }
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
          onUploadSuccess={(newImageUrl) => {
            dispatch(setUploadedImageUrl(newImageUrl));
          }}
          onUploadFailure={(errorMessage) => setUploadError(errorMessage)}
          initiateUpload={isUploading}
        />
      </div>

      {uploadError && <div className="upload-error">{uploadError}</div>}
      <button className="submit-button" type="submit">
        {formType === "Create" ? "Create Post" : "Update Post"}
      </button>
    </form>
  );
};

export default PostForm;
// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useModal } from "../../../context/Modal";
// import {
//   thunkCreatePost,
//   thunkUpdatePost,
//   thunkGetPostsByUserId,
//   thunkGetPostDetails
// } from "../../../store/posts";
// import { setUploadedImageUrl } from "../../../store/aws";
// import { setLoading, setError, clearUIState } from "../../../store/ui";

// import AWSImageUploader from "../../Aws/AWSImageUploader";
// import {
//   selectPostById,
//   selectUserAlbums,
//   selectSessionUser,
//   selectUploadedImageUrl,
// } from "../../../store/selectors";

// import "./PostForm.css";

// const PostForm = ({ postId, formType, onPostCreated, currentPage }) => {
//   const dispatch = useDispatch();
//   const { closeModal } = useModal();
//   const existingPost = useSelector((state) => selectPostById(state, postId));
//   console.log("🚀 ~ file: index.js:34 ~ PostForm ~ existingPost :", existingPost )
//   const userAlbums = useSelector(selectUserAlbums);
//   const sessionUser = useSelector(selectSessionUser);
//   const uploadedImageUrl = useSelector(selectUploadedImageUrl);
//   console.log(
//     "🚀 ~ file: index.js:32 ~ PostForm ~ uploadedImageUrl :",
//     uploadedImageUrl
//   );

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");

//   // const [uploadedImageUrl, setUploadedImageUrl] = useState("");
//   const [uploadError, setUploadError] = useState(null);
//   const [file, setFile] = useState(null);
//   const [triggerUpload, setTriggerUpload] = useState(false);

//   const [isUploading, setIsUploading] = useState(false);

//   useEffect(() => {
//     const fetchAndSetPostData = async () => {
//       if (sessionUser) {
//         const fetchedPost = await dispatch(thunkGetPostDetails(postId))
//         if (formType === "Edit" && fetchedPost) {
//           setTitle(fetchedPost.title);
//           setDescription(fetchedPost.description);
//           dispatch(setUploadedImageUrl(fetchedPost.image));
//         }
//       }
//     };

//     fetchAndSetPostData();
//   }, [dispatch, postId, sessionUser, formType]);


//   const createOrUpdatePost = async (imageUrl) => {
//     if (!imageUrl) {
//       setUploadError("No image URL available for the post");
//       return;
//     }

//     const postData = { title, description, image_url: imageUrl };
//     try {
//        let postResponse;
//     if (formType === "Create") {
//       postResponse = await dispatch(thunkCreatePost(postData));
//     } else if (formType === "Edit") {
//       postResponse = await dispatch(thunkUpdatePost(postId, postData));
//     }

//       console.log("Post response:", postResponse); // Log the response

//       // Check if postResponse contains the expected post data
//       if (postResponse && postResponse.id) {
//         // Additional logic after successful post creation/update
//         setTitle("");
//         setDescription("");
//         dispatch(setUploadedImageUrl(""));
//         setUploadError(null);
//         setIsUploading(false);
//         closeModal();
//         // If the post was created, update the posts list
//         if (formType === "Create") {
//           dispatch(thunkGetPostsByUserId(sessionUser.id, currentPage, 10));
//         }
//       } else {
//         setUploadError("Failed to create/update post");
//         console.log("Post response error:", postResponse); // Log the error response
//       }
//     } catch (error) {
//       setUploadError("An error occurred during post creation/update");
//       console.error("Post creation/update error:", error); // Log any caught errors
//     }
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const postCreationResponse = await createOrUpdatePost(uploadedImageUrl);
//     console.log("Post creation response:", postCreationResponse);

//     // if (postCreationResponse && postCreationResponse.type === "SUCCESS") {
//     //   // Dispatch the thunk to get updated posts after successful post creation
//     //   dispatch(thunkGetPostsByUserId(sessionUser.id, currentPage, 10));
//     // } else {
//     //   // Handle the case where post creation was not successful
//     //   console.error("Post creation failed:", postCreationResponse);
//     // }
//   };

//   return (
//     <form className="post-form" onSubmit={handleSubmit}>
//       <div className="form-group">
//         <input
//           className="form-control"
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Title"
//         />
//       </div>

//       <div className="form-group">
//         <textarea
//           className="form-textarea"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Description"
//         ></textarea>
//       </div>

//       <div className="form-group">
//         <AWSImageUploader
//           onUploadSuccess={(newImageUrl) => {
//             dispatch(setUploadedImageUrl(newImageUrl));
//           }}
//           onUploadFailure={(errorMessage) => setUploadError(errorMessage)}
//           initiateUpload={isUploading}
//         />
//       </div>

//       {uploadError && <div className="upload-error">{uploadError}</div>}
//       <button className="submit-button" type="submit">
//         {formType === "Create" ? "Create Post" : "Update Post"}
//       </button>
//     </form>
//   );
// };

// export default PostForm;
