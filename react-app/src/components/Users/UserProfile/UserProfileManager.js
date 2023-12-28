// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import AWSImageUploader from '../Aws/AWSImageUploader';
// import { updateUserProfilePic } from '../../store/session';

// const UserProfileManager = () => {
//   const dispatch = useDispatch();
//   const [imageUploadInitiated, setImageUploadInitiated] = useState(false);

//   const handleUploadSuccess = (newImageUrl) => {
//     dispatch(updateUserProfilePic(newImageUrl))
//       .then(() => console.log('Profile picture updated successfully'))
//       .catch((error) => console.error('Error updating profile picture:', error));
//   };

//   const handleUploadFailure = (errorMessage) => {
//     console.error('Upload failed:', errorMessage);
//   };

//   return (
//     <div>
//       <AWSImageUploader
//         onUploadSuccess={handleUploadSuccess}
//         onUploadFailure={handleUploadFailure}
//         initiateUpload={imageUploadInitiated}
//       />

//     </div>
//   );
// };

// export default UserProfileManager;


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

// const UserProfileManager = ({ setIsEditingProfilePic, onProfilePicUpdate, refreshPageData,  setReloadPage }) => {
//   const dispatch = useDispatch();
//   const user = useSelector(selectSessionUser);
//   const [imageUploadInitiated, setImageUploadInitiated] = useState(false);
//   const [profileData, setProfileData] = useState({ ...user });
//   const userProfileManagerRef = useRef(null);

//   const [uploadImage, setUploadImage] = useState(null);



//   const handleUploadSuccess = async () => {
//     if (!uploadImage) return;
//     setImageUploadInitiated(true);
//     try {
//       const imageUrl = await uploadImage();
//       if (imageUrl) {
//         dispatch(updateUserProfile({ profile_picture: imageUrl }));
//         onProfilePicUpdate(imageUrl);
//       }
//     } catch (error) {
//       console.error('Error updating profile picture:', error);
//     } finally {
//       setImageUploadInitiated(false);
//     }
//   };

//   useEffect(() => {
//     if (imageUploadInitiated) {
//       handleUploadSuccess();
//     }
//   }, [imageUploadInitiated]);

//   const handleUploadFailure = (errorMessage) => {
//     console.error('Upload failed:', errorMessage);
//     dispatch(setLoading(false));
//   };

//   function useOutsideAlerter(ref) {
//     useEffect(() => {
//       function handleClickOutside(event) {
//         if (ref.current && !ref.current.contains(event.target)) {
//           setIsEditingProfilePic(false);
//         }
//       }

//       document.addEventListener("mousedown", handleClickOutside);
//       return () => {
//         document.removeEventListener("mousedown", handleClickOutside);
//       };
//     }, [ref]);
//   }

//   useOutsideAlerter(userProfileManagerRef);

//   return (
//     <div ref={userProfileManagerRef}>
//       <AWSImageUploader
//         onUploadSuccess={handleUploadSuccess}
//         // onUploadFailure={handleUploadFailure}
//         // initiateUpload={imageUploadInitiated}
//       />
//     </div>
//   );
// };
const UserProfileManager = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(selectSessionUser);
  const [profileData, setProfileData] = useState({ ...user });
  const [uploadImage, setUploadImage] = useState(null);
  const [showUploader, setShowUploader] = useState(false);

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

    let imageUrl = profileData.profile_picture;
    if (uploadImage) {
      imageUrl = await uploadImage();
    }

    const updatedProfileData = { ...profileData, profile_picture: imageUrl };
    await dispatch(updateUserProfile(updatedProfileData));

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
          <div className="user-profile-image">
            {user.profile_picture ? (
              <img className="user-image" src={user.profile_picture} alt="Profile" />
            ) : (
              <div className="user-initials">{userInitials}</div>
            )}
            <div className="edit-icon-overlay">
              <FontAwesomeIcon icon={faCamera} className="edit-icon" />
            </div>
          </div>
          {showUploader && <AWSImageUploader setUploadImage={setUploadImage} />}
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



// import React, { useState, useEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';
// import AWSImageUploader from '../Aws/AWSImageUploader';
// import { updateUserProfilePic, setUser } from '../../store/session';
// import { setLoading } from '../../store/ui';

// const UserProfileManager = ({ setIsEditingProfilePic }) => {
//   const dispatch = useDispatch();
//   const [imageUploadInitiated, setImageUploadInitiated] = useState(false);
//   const userProfileManagerRef = useRef(null);

//   const handleUploadSuccess = (newImageUrl) => {
//     dispatch(updateUserProfilePic(newImageUrl))
//       .then((updatedUser) => {
//         console.log('Profile picture updated successfully');
//         // dispatch(setUser(updatedUser));
//         setIsEditingProfilePic(false);
//       })
//       .catch((error) => console.error('Error updating profile picture:', error));
//   };

//   const handleUploadFailure = (errorMessage) => {
//     console.error('Upload failed:', errorMessage);
//   };

//   function useOutsideAlerter(ref) {
//     useEffect(() => {
//       function handleClickOutside(event) {
//         if (ref.current && !ref.current.contains(event.target)) {
//           setIsEditingProfilePic(false);
//         }
//       }

//       document.addEventListener("mousedown", handleClickOutside);
//       return () => {

//         document.removeEventListener("mousedown", handleClickOutside);
//       };
//     }, [ref]);
//   }


//   useOutsideAlerter(userProfileManagerRef);

//   return (
//     <div ref={userProfileManagerRef}>
//       <AWSImageUploader
//         onUploadSuccess={handleUploadSuccess}
//         onUploadFailure={handleUploadFailure}
//         initiateUpload={imageUploadInitiated}
//       />

//     </div>
//   );
// };

// export default UserProfileManager;
