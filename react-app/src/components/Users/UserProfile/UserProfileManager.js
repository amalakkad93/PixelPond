import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faCamera } from "@fortawesome/free-solid-svg-icons";
import AWSImageUploader from '../../Aws/AWSImageUploader';
import { updateUserProfilePic, setUser, updateUserProfile } from '../../../store/session';
import {selectSessionUser} from '../../../store/selectors';

import { setLoading } from '../../../store/ui';

import './UserProfileManager.css';

const UserProfileManager = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(selectSessionUser);
  const [profileData, setProfileData] = useState({ ...user });
  const [uploadProfileImage, setUploadProfileImage] = useState(null);
  const [uploadBannerImage, setUploadBannerImage] = useState(null);
  const [showUploader, setShowUploader] = useState(false);
  const [imageError, setImageError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const userInitials =
    user.first_name?.charAt(0)?.toUpperCase() +
    user.last_name?.charAt(0)?.toUpperCase();

  useEffect(() => {
    if (user) {
      setProfileData({ ...user });
    }
  }, [user]);

  const handleInputChange = (event) => {
    const updatedProfileData = { ...profileData, [event.target.name]: event.target.value };
    setProfileData(updatedProfileData);
    console.log(updatedProfileData);
  };



  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    // let imageProfileUrl = null;
    // let imageBannerUrl = null;
    let imageProfileUrl = profileData.profile_picture;
    let imageBannerUrl = profileData.banner_picture;
    try {
      if (uploadProfileImage) {
        const newProfileImageUrl = await uploadProfileImage();
        if (newProfileImageUrl) {
          imageProfileUrl = newProfileImageUrl; // Update if new image is uploaded
        }
      }

      if (uploadBannerImage) {
        const newBannerImageUrl = await uploadBannerImage();
        if (newBannerImageUrl) {
          imageBannerUrl = newBannerImageUrl; // Update if new image is uploaded
        }
      }

      const updatedProfileData = { ...profileData, profile_picture: imageProfileUrl, banner_picture: imageBannerUrl };
      await dispatch(updateUserProfile(updatedProfileData));

    } catch (error) {
      console.error("Error uploading images", error);
      // Handle the error appropriately
    }

    setIsSubmitting(false);
    history.push('/user/profile');
  };



  const handleUploadSuccess = (imageUrl) => {
    if (imageUrl) {
      const updatedProfileData = { ...profileData, profile_picture: imageUrl };
      dispatch(updateUserProfile(updatedProfileData));
      setShowUploader(false);
    }
  };

  return (
    <div className="user-profile-manager">
      <form onSubmit={handleSubmit}>
      <div className="form-field profile-picture-field" onClick={() => setShowUploader(true)}>
          {/* <label>Profile Picture</label> */}
            {/* <div className="edit-icon-overlay"> */}
          <div className="user-profile-image">
            {user.profile_picture ? (
              <img className="user-image" src={user.profile_picture} alt="Profile" />
            ) : (
              <div className="user-initials">{userInitials}</div>
            )}
              <FontAwesomeIcon icon={faCamera} className="edit-icon-user-profile" />
            {/* </div> */}
          </div>
          {showUploader && <AWSImageUploader setUploadImage={setUploadProfileImage}/>}
        </div>
        <div className="form-field">
          <label>Banner Picture</label>
          {<AWSImageUploader setUploadImage={setUploadBannerImage} />}
          </div>
        <div className="form-field">
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            value={profileData.first_name}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-field">
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            value={profileData.last_name}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-field">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={profileData.username}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-field">
          <label>About Me</label>
          <textarea
            name="about_me"
            value={profileData.about_me}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-field">
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={profileData.country}
            onChange={handleInputChange}
          />
        </div>

        {/* <button type="submit"  onClick={ () => history.push('/user/profile')} className="submit-button">Save Changes</button> */}
        <button type="submit"   className="submit-button">Save Changes</button>
      </form>
    </div>
  );
};

export default UserProfileManager;
