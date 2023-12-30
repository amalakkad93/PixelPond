import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPresignedUrl, deleteImage } from "../../store/aws";

import "./AWSImageUploader.css";

const AWSImageUploader =  ({ setUploadImage, setImageError, onUploadSuccess }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (file) {
      const upload = async () => {
        const presignedData = await dispatch(getPresignedUrl(file.name, file.type));
        if (!presignedData) throw new Error("Failed to get presigned URL");

        const xhr = new XMLHttpRequest();
        xhr.open("PUT", presignedData.presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);

        return new Promise((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status === 200) {
              onUploadSuccess(true);
              resolve(presignedData.fileUrl + "?t=" + new Date().getTime());
            } else {
              onUploadSuccess(false);
              reject("Failed to upload image");
            }
          };
          xhr.onerror = () => reject("Error during the upload");
        });
      };


      setUploadImage(() => upload);
    }
  }, [file, dispatch, setUploadImage, onUploadSuccess]);

  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      if (!newFile.type.startsWith("image/")) {
        setImageError("Please select an image file");
        return;
      }

      if (newFile.size > 5242880) {
        setImageError("File size must be less than 5MB");
        return;
      }

      setImageError("");
      setFile(newFile);
      setPreview(URL.createObjectURL(newFile));
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {uploading && (
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-bar-inner" style={{ width: `${progress}%` }}>
              {progress}%
            </div>
          </div>
          <div className="profile-preview">
            {preview && <img src={preview} alt="Profile Preview" />}
          </div>
        </div>
      )}
       { setImageError && <p className="error">{setImageError}</p> }
    </div>
  );
};

export default AWSImageUploader;

  // const uploadImage = async () => {
  //   if (!file) {
  //     throw new Error("No file selected for upload.");
  //   }

  //   setUploading(true);
  //   setProgress(0);

  //   try {
  //     const presignedData = await dispatch(getPresignedUrl(file.name, file.type));
  //     if (!presignedData) throw new Error("Failed to get presigned URL");

  //     const xhr = new XMLHttpRequest();
  //     xhr.open("PUT", presignedData.presignedUrl);
  //     xhr.setRequestHeader("Content-Type", file.type);

  //     return new Promise((resolve, reject) => {
  //       xhr.upload.onprogress = (event) => {
  //         if (event.lengthComputable) {
  //           const percentComplete = Math.round((event.loaded / event.total) * 100);
  //           setProgress(percentComplete);
  //         }
  //       };

  //       xhr.onload = () => {
  //         if (xhr.status === 200) {
  //           setUploading(false);
  //           resolve(presignedData.fileUrl + "?t=" + new Date().getTime());
  //         } else {
  //           setUploading(false);
  //           reject("Failed to upload image");
  //         }
  //       };

  //       xhr.onerror = () => {
  //         setUploading(false);
  //         reject("Error during the upload");
  //       };

  //       xhr.send(file);
  //     });
  //   } catch (error) {
  //     setUploading(false);
  //     throw error;
  //   }
  // };




// const AWSImageUploader = ({
//   onUploadSuccess,
//   onUploadFailure,
//   initiateUpload,
// }) => {
  // const dispatch = useDispatch();
  // const [file, setFile] = useState(null);
  // const [uploading, setUploading] = useState(false);
  // const [progress, setProgress] = useState(0);
  // const [preview, setPreview] = useState(null);

//   const handleUpload = (uploadFile) => {
//     setUploading(true);
//     setProgress(0);

//     dispatch(getPresignedUrl(uploadFile.name, uploadFile.type))
//       .then((presignedData) => {
//         if (!presignedData) {
//           setUploading(false);
//           onUploadFailure("Failed to get presigned URL");
//           return;
//         }

//         const xhr = new XMLHttpRequest();
//         xhr.open("PUT", presignedData.presignedUrl);

//         xhr.upload.onprogress = (event) => {
//           if (event.lengthComputable) {
//             const percentComplete = Math.round(
//               (event.loaded / event.total) * 100
//             );
//             setProgress(percentComplete);
//           }
//         };

//         xhr.onload = () => {
//           if (xhr.status === 200) {
//             const newImageUrlWithCacheBust =
//               presignedData.fileUrl + "?t=" + new Date().getTime();
//             onUploadSuccess(newImageUrlWithCacheBust);
//           } else {
//             onUploadFailure("Failed to upload image");
//           }
//           setUploading(false);
//         };

//         xhr.onerror = () => {
//           onUploadFailure("Error during the upload");
//           setUploading(false);
//         };

//         xhr.setRequestHeader("Content-Type", uploadFile.type);
//         xhr.send(uploadFile);
//       })
//       .catch((error) => {
//         setUploading(false);
//         onUploadFailure(error.message);
//       });
//   };

//   const handleFileChange = (e) => {
//     const newFile = e.target.files[0];
//     if (newFile) {
//       setFile(newFile);
//       setPreview(URL.createObjectURL(newFile));
//       handleUpload(newFile);
//     }
//   };

//   useEffect(() => {
//     if (initiateUpload && file) {
//       handleUpload(file);
//     }
//   }, [initiateUpload, file]);

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       {uploading && (
//         <div className="progress-container">
//           <div className="progress-bar">
//             <div
//               className="progress-bar-inner"
//               style={{ width: `${progress}%` }}
//             >
//               {progress}%
//             </div>
//           </div>
//           <div className="profilePreview">
//             {preview ? (
//               <img
//                 src={preview}
//                 alt="Profile Preview"
//                 onClick={() => document.getElementById("fileInput").click()}
//               />
//             ) : (
//               <div className="profilePreviewText">
//                 Click to upload profile picture
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AWSImageUploader;
