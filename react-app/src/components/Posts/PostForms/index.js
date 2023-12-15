import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { thunkCreatePost, thunkUpdatePost } from "../../../store/posts";
import AWSImageUploader from "../../Images/AWSImageUploader";
import {
  selectPostById,
  selectUserAlbums,
  selectSessionUser,
} from "../../../store/selectors";

import {
  thunkGetAlbumsByUserId,
  thunkCreateAlbum,
  thunkUpdateAlbum,
} from "../../../store/albums";
import CreateAlbum from "../../Albums/CreateAlbum";
import EditAlbum from "../../Albums/EditAlbum";

import "./PostForm.css";

const PostForm = ({ postId, formType }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const existingPost = useSelector((state) => selectPostById(state, postId));
  const userAlbums = useSelector(selectUserAlbums);
  const sessionUser = useSelector(selectSessionUser);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [albumTitle, setAlbumTitle] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadError, setUploadError] = useState(null);
  const [file, setFile] = useState(null);
  const [triggerUpload, setTriggerUpload] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (sessionUser) dispatch(thunkGetAlbumsByUserId(sessionUser.id));
    if (formType === "Edit" && existingPost) {
      setTitle(existingPost.title);
      setDescription(existingPost.description);
      setAlbumId(existingPost.album_id);
      setUploadedImageUrl(existingPost.image);
    }
  }, [formType, existingPost, sessionUser, dispatch]);

  // const validateForm = () => {
  //   if (!title.trim() || (formType === "Create" && !uploadedImageUrl)) {
  //     setUploadError("Title and image are required for new posts");
  //     return false;
  //   }
  //   return true;
  // };

  const createOrUpdatePost = async () => {
    let usedAlbumId = albumId;
    if (albumTitle && !albumId) {
      const albumResponse = await dispatch(thunkCreateAlbum({ title: albumTitle }));
      if (!albumResponse || albumResponse.type !== "SUCCESS") {
        setUploadError("Failed to create album");
        return;
      }
      usedAlbumId = albumResponse.data.id;
    }

    const postData = {
      title,
      description,
      album_id: usedAlbumId,
      image_url: uploadedImageUrl,
    };

    let postResponse;
    if (formType === "Create") {
      postResponse = await dispatch(thunkCreatePost(postData));
    } else {
      postResponse = await dispatch(thunkUpdatePost(postId, postData));
    }

    if (!postResponse || postResponse.type !== "SUCCESS") {
      setUploadError("Failed to create/update post");
      return;
    }


    setTitle("");
    setDescription("");
    setAlbumId("");
    setAlbumTitle("");
    setUploadedImageUrl("");
    setUploadError(null);
    setIsUploading(false);
    closeModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) return;

    if (formType === "Create" && !uploadedImageUrl) {
      setIsUploading(true);
    } else {
      await createOrUpdatePost();
    }
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
        <label htmlFor="albumSelect">Choose an Album (optional):</label>
        <select
          id="albumSelect"
          className="form-select"
          value={albumId}
          onChange={(e) => setAlbumId(e.target.value)}
        >
          <option value="">No Album</option>
          {userAlbums.map((album) => (
            <option key={album.id} value={album.id}>
              {album.title}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
      <AWSImageUploader
        onUploadSuccess={(url) => {
          setUploadedImageUrl(url);
          createOrUpdatePost();
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
// import { thunkCreatePost, thunkUpdatePost } from "../../../store/posts";
// import AWSImageUploader from "../../Images/AWSImageUploader";
// import {
//   selectPostById,
//   selectUserAlbums,
//   selectSessionUser,
// } from "../../../store/selectors";

// import {
//   thunkGetAlbumsByUserId,
//   thunkCreateAlbum,
//   thunkUpdateAlbum,
// } from "../../../store/albums";
// import CreateAlbum from "../../Albums/CreateAlbum";
// import EditAlbum from "../../Albums/EditAlbum";

// import "./PostForm.css";

// const PostForm = ({ postId, formType }) => {
//   const dispatch = useDispatch();
//   const { closeModal } = useModal();
//   const existingPost = useSelector((state) => selectPostById(state, postId));
//   const userAlbums = useSelector(selectUserAlbums);
//   const sessionUser = useSelector(selectSessionUser);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [albumId, setAlbumId] = useState("");
//   const [albumTitle, setAlbumTitle] = useState("");
//   const [uploadedImageUrl, setUploadedImageUrl] = useState("");
//   const [uploadError, setUploadError] = useState(null);
//   const [file, setFile] = useState(null);

//   useEffect(() => {
//     if (sessionUser) dispatch(thunkGetAlbumsByUserId(sessionUser.id));
//     if (formType === "Edit" && existingPost) {
//       setTitle(existingPost.title);
//       setDescription(existingPost.description);
//       setAlbumId(existingPost.album_id);
//       setUploadedImageUrl(existingPost.image);
//     }
//   }, [formType, existingPost, sessionUser, dispatch]);

//   const validateForm = () => {
//     if (!title.trim() || !uploadedImageUrl) {
//       setUploadError("Title and image are required");
//       return false;
//     }
//     if (albumTitle && !albumId) {
//       if (!albumTitle.trim()) {
//         setUploadError("Album title is required for a new album");
//         return false;
//       }
//     }
//     return true;
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       let usedAlbumId = albumId;
//       if (albumTitle && !albumId) {
//         const albumResponse = await dispatch(thunkCreateAlbum({ title: albumTitle }));
//         if (!albumResponse || albumResponse.type !== "SUCCESS") {
//           setUploadError("Failed to create album");
//           return;
//         }
//         usedAlbumId = albumResponse.data.id;
//       }

//       const postData = {
//         title,
//         description,
//         album_id: usedAlbumId || null,
//         image_url: uploadedImageUrl,
//       };

//       let postResponse;
//       if (formType === "Create") {
//         const response = await dispatch(thunkCreatePost(postData));
//         if (response && response.type === "SUCCESS") {
//           postResponse = response.data;
//         }
//       } else {
//         const response = await dispatch(thunkUpdatePost(postId, postData));
//         if (response && response.type === "SUCCESS") {
//           postResponse = response.data;
//         }
//       }

//       if (!postResponse) {
//         setUploadError("Failed to create/update post");
//         return;
//       }

//       console.log("Post successfully created/updated:", postResponse);

//       // Reset form state and errors after successful submission
      // setTitle("");
      // setDescription("");
      // setAlbumId("");
      // setAlbumTitle("");
      // setUploadedImageUrl("");
      // setUploadError(null);


//       closeModal()

//     } catch (error) {
//       setUploadError("An error occurred during the request");
//       console.error("Error:", error);
//     }
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
//         <label htmlFor="albumSelect">Choose an Album (optional):</label>
//         <select
//           id="albumSelect"
//           className="form-select"
//           value={albumId}
//           onChange={(e) => setAlbumId(e.target.value)}
//         >
//           <option value="">No Album</option>
//           {userAlbums.map((album) => (
//             <option key={album.id} value={album.id}>
//               {album.title}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="form-group">
//         <AWSImageUploader
//           onUploadSuccess={(url) => setUploadedImageUrl(url)}
//           onUploadFailure={(errorMessage) => setUploadError(errorMessage)}
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
