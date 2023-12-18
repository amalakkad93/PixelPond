import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPresignedUrl, deleteImage } from '../../store/aws';



const AWSImageUploader = ({ onUploadSuccess, onUploadFailure, initiateUpload }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const handleUpload = async (uploadFile) => {
    if (!uploadFile) {
      onUploadFailure("No file selected");
      return;
    }

    try {
      const presignedData = await dispatch(getPresignedUrl(uploadFile.name, uploadFile.type));
      if (!presignedData) {
        throw new Error("Failed to get presigned URL");
      }

      const uploadResult = await fetch(presignedData.presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": uploadFile.type },
        body: uploadFile,
      });

      if (uploadResult.status === 200) {
        // onUploadSuccess(presignedData.fileUrl);
        const newImageUrlWithCacheBust = presignedData.fileUrl + "?t=" + new Date().getTime();
        onUploadSuccess(newImageUrlWithCacheBust);
      } else {
        onUploadFailure("Failed to upload image");
      }
    } catch (error) {
      onUploadFailure(error.message);
    }
  };

  // Function to handle file selection
  const handleFileChange = async (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      setFile(newFile);
      await handleUpload(newFile);
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

//   const handleFileChange = (e) => {
//     const newFile = e.target.files[0];
//     if (newFile) {
//       setFile(newFile);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       onUploadFailure("No file selected");
//       return;
//     }

//     try {
//       // Dispatch getPresignedUrl thunk with the file details
//       await dispatch(getPresignedUrl(file.name, file.type, file));
//       // You may want to handle the success case here, depending on how you've set up your thunk.
//       // For example, if your thunk dispatches an action to set the uploaded image URL upon success,
//       // then you can simply rely on that. Otherwise, you might want to call onUploadSuccess here.
//     } catch (error) {
//       onUploadFailure(error.message);
//     }
//   };

//   useEffect(() => {
//     if (initiateUpload && file) {
//       handleUpload();
//     }
//   }, [initiateUpload, file, dispatch]);

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//     </div>
//   );
// };

// export default AWSImageUploader;
