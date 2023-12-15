import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPresignedUrl, deleteImage } from '../../store/images';

const AWSImageUploader = ({ onUploadSuccess, onUploadFailure, initiateUpload }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);

  useEffect(() => {

    if (initiateUpload && file) {
      handleUpload();
    }
  }, [initiateUpload, file]);

  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      setFile(newFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      onUploadFailure("No file selected");
      return;
    }

    // Step 1: Get presigned URL
    const filename = encodeURIComponent(file.name);
    try {
      const presignedResponse = await fetch(`/api/s3/generate_presigned_url?filename=${encodeURIComponent(file.name)}&contentType=${file.type}`);
      if (!presignedResponse.ok) throw new Error('Failed to get presigned URL');

      const { presigned_url, file_url } = await presignedResponse.json();

      // Step 2: Use the presigned URL to upload the file to S3
      const uploadResult = await fetch(presigned_url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (uploadResult.status !== 200) throw new Error('Failed to upload image');

      // Image uploaded successfully, pass the file_url back
      onUploadSuccess(file_url);
    } catch (error) {
      onUploadFailure(error.message);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {/* <button onClick={handleUpload}>Upload</button> */}
    </div>
  );
};


export default AWSImageUploader;
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { getPresignedUrl, deleteImage } from '../../store/images';

// const AWSImageUploader = ({ onUploadSuccess, onUploadFailure, initiateUpload }) => {
//   const dispatch = useDispatch();
//   const [file, setFile] = useState(null);

//   useEffect(() => {
//     if (initiateUpload && file) {
//       handleUpload();
//     }
//   }, [initiateUpload, file]);

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

//     // Step 1: Get presigned URL
//     const filename = encodeURIComponent(file.name);
//     try {
//       const presignedResponse = await fetch(`/api/s3/generate_presigned_url?filename=${encodeURIComponent(file.name)}&contentType=${file.type}`);
//       if (!presignedResponse.ok) throw new Error('Failed to get presigned URL');

//       const { presigned_url, file_url } = await presignedResponse.json();

//       // Step 2: Use the presigned URL to upload the file to S3
//       const uploadResult = await fetch(presigned_url, {
//         method: 'PUT',
//         headers: { 'Content-Type': file.type },
//         body: file,
//       });

//       if (uploadResult.status !== 200) throw new Error('Failed to upload image');

//       // Image uploaded successfully, pass the file_url back
//       onUploadSuccess(file_url);
//     } catch (error) {
//       onUploadFailure(error.message);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload</button>
//     </div>
//   );
// };


// export default AWSImageUploader;
