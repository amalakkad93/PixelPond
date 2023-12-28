import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '../../../store/session';

const ProfilePictureUpdater = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const uploadImageToS3 = async (presignedUrl, file) => {
    try {
      await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: new Headers({
          'Content-Type': file.type,
        }),
      });
      return presignedUrl.split('?')[0]; 
    } catch (error) {
      console.error("Error uploading image to S3:", error);
      return null;
    }
  };

  const handleFileChange = async (e) => {
    const newFile = e.target.files[0];
    setFile(newFile);
    setPreview(URL.createObjectURL(newFile));

    const response = await fetch(`/api/users/presigned-url?file_name=${newFile.name}&file_type=${newFile.type}`);
    if (!response.ok) {
      console.error("Failed to get presigned URL");
      return;
    }

    const { presigned_url } = await response.json();
    const uploadedImageUrl = await uploadImageToS3(presigned_url, newFile);

    if (uploadedImageUrl) {
      dispatch(updateUserProfile({ profile_picture: uploadedImageUrl }));
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Profile Preview" style={{ maxWidth: '200px' }} />}
    </div>
  );
};

export default ProfilePictureUpdater;
