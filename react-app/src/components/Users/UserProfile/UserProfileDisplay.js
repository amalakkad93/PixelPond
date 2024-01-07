import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkSearchUsers } from "../../../store/session";
import { selectSearchedUserDisplay  } from '../../../store/selectors';

import './UserProfileDisplay.css';

const UserProfileDisplay = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const users = useSelector(selectSearchedUserDisplay );

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get('search');
    if (searchTerm) {
      dispatch(thunkSearchUsers(searchTerm));
    }
  }, [dispatch, location.search]);


  if (!users || users.length === 0) {
    return null;
  }

  return (
    <div className="user-profiles-container">
      {users && users.map((user) => (
         <div key={user?.id} className="user-profile" onClick={() => history.push(`/posts/users/${user?.id}`)}>
          <div className="profile-picture-container">
            <img
              src={user?.profile_picture || '/default-profile.png'}
              alt={`${user?.first_name} ${user?.last_name}`}
              className="profile-picture"
            />
          </div>
          <div className="user-info-container">
            <div className="user-name">{`${user?.first_name} ${user?.last_name}`}</div>
            <div className="user-username">@{user?.username}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserProfileDisplay;
