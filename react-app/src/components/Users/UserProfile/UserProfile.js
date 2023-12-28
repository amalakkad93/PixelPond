import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faCamera } from "@fortawesome/free-solid-svg-icons";
import UserProfileManager from "./UserProfileManager";
import "./UserProfile.css";

export default function UserProfile() {
  const history = useHistory();

  const user = useSelector((state) => state.session.user);

  if (!user) return null;
  const userInitials =
    user.first_name?.charAt(0)?.toUpperCase() +
    user.last_name?.charAt(0)?.toUpperCase();

  return (
    <div className="user-profile-container">
      <div className="user-profile-image">
        {user.profile_picture ? (
          <img
            className="user-image"
            src={user.profile_picture}
            alt="Profile"
          />
        ) : (
          <div className="user-initials">{userInitials}</div>
        )}
        </div>

      <div className="user-profile-header">
        <h2>
          {user.first_name} {user.last_name}
        </h2>
        <FontAwesomeIcon
          icon={faEdit}
          className="edit-icon"
          onClick={ () => history.push('/user/profile/edit')}
        />
      </div>
      <div className="user-details">
        <p>Email: {user.email}</p>
        <p>Username: {user.username}</p>
        <p>Age: {user.age}</p>
        <p>Country: {user.country}</p>
        <p>About Me: {user.about_me}</p>
      </div>
    </div>
  );
}

//     return (
//         <div className="user-profile-container">
//             <div className="user-initials">
//                 {user.first_name.charAt(0).toUpperCase()}{user.last_name.charAt(0).toUpperCase()}
//             </div>
//             <h2 className="user-name">{user.firstName} {user.lastName}</h2>
//             <ul className="user-details">
//                 <li><strong>Username:</strong> {user.username}</li>
//                 <li><strong>Email:</strong> {user.email}</li>
//             </ul>
//         </div>
//     );
// }
