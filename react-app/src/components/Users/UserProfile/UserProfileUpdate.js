import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../../../store/session';

const UserProfileUpdate = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name,
    last_name: user?.last_name,
    email: user?.email,
    username: user?.username,
    about_me: user?.about_me,
    country: user?.country,
    profile_picture: user?.profile_picture,
  });
  const [uploadImage, setUploadImage] = useState(null);



  const handleInputChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserProfile(profileData));
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Input fields for profile data */}
      <input
        type="text"
        name="first_name"
        value={profileData?.first_name}
        onChange={handleInputChange}
      />
      {/* Include other fields similarly */}
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default UserProfileUpdate;
