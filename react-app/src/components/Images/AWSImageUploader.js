import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPresignedUrl, deleteImage } from '../../store/images';

const AWSImageUploader = ({ onUploadSuccess, onUploadFailure }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const uploadUrl = useSelector((state) => state.images.uploadUrl);
  const imageUrl = useSelector((state) => state.images.imageUrl);

  useEffect(() => {
    if (imageUrl) {
      onUploadSuccess(imageUrl);
    }
  }, [imageUrl, onUploadSuccess]);

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
    await dispatch(getPresignedUrl(filename, file.type));

    // Step 2: Use the presigned URL to upload the file to S3
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    };
    try {
      const result = await fetch(uploadUrl, options);
      if (result.status !== 200) {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      onUploadFailure(error.message);
    }
  };

  const handleDelete = async () => {
    if (imageUrl) {
      await dispatch(deleteImage(imageUrl));
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default AWSImageUploader;
