import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfoById } from '../../../store/session';

export default function UserInfo({ userId }) {
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.usersById[userId]);

  useEffect(() => {
    dispatch(fetchUserInfoById(userId));
  }, [dispatch, userId]);

  const userFullName = `${userInfo?.first_name || ''} ${userInfo?.last_name || ''}`;
  const userAge = userInfo?.age;
  const userUsername = userInfo?.username;
  const userEmail = userInfo?.email;
  const userAboutMe = userInfo?.about_me;
  const userCountry = userInfo?.country;
  const profilePhoto = userInfo?.profile_photo;

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>`${userInfo?.first_name || ""} ${userInfo?.last_name || ""}`;</p>

    </div>
  );
};
