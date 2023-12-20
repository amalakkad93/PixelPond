import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPresignedUrl, deleteImage } from '../../store/aws';

import './AWSImageUploader.css';


const AWSImageUploader = ({ onUploadSuccess, onUploadFailure, initiateUpload }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = (uploadFile) => {
    setUploading(true);
    setProgress(0);

    dispatch(getPresignedUrl(uploadFile.name, uploadFile.type)).then(presignedData => {
      if (!presignedData) {
        setUploading(false);
        onUploadFailure("Failed to get presigned URL");
        return;
      }

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", presignedData.presignedUrl);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const newImageUrlWithCacheBust = presignedData.fileUrl + "?t=" + new Date().getTime();
          onUploadSuccess(newImageUrlWithCacheBust);
        } else {
          onUploadFailure("Failed to upload image");
        }
        setUploading(false);
      };

      xhr.onerror = () => {
        onUploadFailure("Error during the upload");
        setUploading(false);
      };

      xhr.setRequestHeader("Content-Type", uploadFile.type);
      xhr.send(uploadFile);
    }).catch(error => {
      setUploading(false);
      onUploadFailure(error.message);
    });
  };

  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      setFile(newFile);
      handleUpload(newFile);
    }
  };

  useEffect(() => {
    if (initiateUpload && file) {
      handleUpload(file);
    }
  }, [initiateUpload, file]);

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
        </div>
      )}
    </div>
  );
};

export default AWSImageUploader;


// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { getPresignedUrl, deleteImage } from '../../store/aws';



// const AWSImageUploader = ({ onUploadSuccess, onUploadFailure, initiateUpload }) => {
//   const dispatch = useDispatch();
//   const [file, setFile] = useState(null);
//   const handleUpload = async (uploadFile) => {
//     if (!uploadFile) {
//       onUploadFailure("No file selected");
//       return;
//     }

//     try {
//       const presignedData = await dispatch(getPresignedUrl(uploadFile.name, uploadFile.type));
//       if (!presignedData) {
//         throw new Error("Failed to get presigned URL");
//       }

//       const uploadResult = await fetch(presignedData.presignedUrl, {
//         method: "PUT",
//         headers: { "Content-Type": uploadFile.type },
//         body: uploadFile,
//       });

//       if (uploadResult.status === 200) {
//         // onUploadSuccess(presignedData.fileUrl);
//         const newImageUrlWithCacheBust = presignedData.fileUrl + "?t=" + new Date().getTime();
//         onUploadSuccess(newImageUrlWithCacheBust);
//       } else {
//         onUploadFailure("Failed to upload image");
//       }
//     } catch (error) {
//       onUploadFailure(error.message);
//     }
//   };

//   // Function to handle file selection
//   const handleFileChange = async (e) => {
//     const newFile = e.target.files[0];
//     if (newFile) {
//       setFile(newFile);
//       await handleUpload(newFile);
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
//     </div>
//   );
// };

// export default AWSImageUploader;
