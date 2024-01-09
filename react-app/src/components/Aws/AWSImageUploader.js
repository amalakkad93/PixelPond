import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPresignedUrl, deleteImage } from "../../store/aws";

import "./AWSImageUploader.css";

const AWSImageUploader = ({ setUploadImage }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null);

  const [fileForUpload, setFileForUpload] = useState(null);
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
      {/* <input className="aws-input" type="file" onChange={handleFileChange} /> */}
      <label htmlFor="file-upload" className="custom-file-upload">
        Upload photos
      </label>
      <input
        id="file-upload"
        className="aws-input"
        type="file"
        onChange={handleFileChange}
      />

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
