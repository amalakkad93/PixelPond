/**
 * AWSImageUploader Component
 *
 * This component is designed for uploading images to AWS S3. It allows users to select an image file
 * and uploads it to S3 using a presigned URL obtained from the server. The component uses Redux for
 * dispatching the action to get the presigned URL. It handles the file upload asynchronously and
 * provides a preview of the selected image.
 *
 * The component's structure includes:
 * - State management for the file, upload status, progress, and image preview.
 * - An effect hook to set up the upload function when a file is selected.
 * - A file input for users to select an image.
 * - Display of upload progress and image preview.
 *
 * @param {function} setUploadImage - Callback function to set the image upload handler.
 */
import React, { useState, useEffect } from "react";
import { useDispatch, } from "react-redux";
import { getPresignedUrl, } from "../../store/aws";

import "./AWSImageUploader.css";

const AWSImageUploader = ({ setUploadImage }) => {
  const dispatch = useDispatch();
  // State for the file, upload status, progress, and image preview
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  const [fileForUpload, setFileForUpload] = useState(null);

  // useEffect hook to set up the file upload process
  useEffect(() => {
    if (file) {
      const upload = async () => {
        const presignedData = await dispatch(
          getPresignedUrl(file.name, file.type)
        );
        if (!presignedData) throw new Error("Failed to get presigned URL");

        const xhr = new XMLHttpRequest();
        xhr.open("PUT", presignedData.presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);

        return new Promise((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve(presignedData.fileUrl + "?t=" + new Date().getTime());
            } else {
              reject("Failed to upload image");
            }
          };
          xhr.onerror = () => reject("Error during the upload");
        });
      };

      setUploadImage(() => upload);
    }
  }, [file, dispatch, setUploadImage]);

  // Function to handle file selection and set up state
  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      setFile(newFile);
      setPreview(URL.createObjectURL(newFile));
      setFileForUpload(newFile);
    }
  };

  return (
    <div className="aws-main-container">
      {/* File input and upload button */}
      <label htmlFor="file-upload" className="custom-file-upload">
        Upload photos
      </label>
      <input
        id="file-upload"
        className="aws-input"
        type="file"
        onChange={handleFileChange}
      />
      {/* Conditional rendering for upload progress and image preview */}
      {uploading && (
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-bar-inner"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
          <div className="profile-preview">
            {preview && <img src={preview} alt="Profile Preview" />}
          </div>
        </div>
      )}
    </div>
  );
};

export default AWSImageUploader;
