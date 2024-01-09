import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faCamera } from "@fortawesome/free-solid-svg-icons";
import UserProfileManager from "./UserProfileManager";
import profileImage1 from "../../../assets/images/profileImage1.png";
import profileImage2 from "../../../assets/images/profileImage2.png";

import "./UserProfile.css";

export default function UserProfile() {
  const history = useHistory();

  const user = useSelector((state) => state.session.user);

  if (!user) return null;

  // Function to get random default image
  const getRandomDefaultImage = () => {
    const images = [profileImage1, profileImage2];
    return images[Math.floor(Math.random() * images.length)];
  };

  const userInitials =
    user.first_name?.charAt(0)?.toUpperCase() +
    user.last_name?.charAt(0)?.toUpperCase();
  const profileImage = user.profile_picture || getRandomDefaultImage();

  return (
    <div className="user-profile-page">
      <div className="user-profile-container">
        <div className="user-profile-image">
          {user.profile_picture ? (
            <>
              <img
                className="user-image"
                src={user.profile_picture}
                alt="Profile"
              />
              {/* <button className="change-profile-btn">
              <FontAwesomeIcon icon={faCamera} className="camera-icon" />
              </button> */}
            </>
          ) : (
            // <div className="user-initials">{userInitials}</div>
            <div className="user-initials">
              <img className="user-image" src={profileImage} alt="Profile" />
            </div>
          )}
        </div>

        <div className="user-profile-header">
          <h2>
            {user.first_name} {user.last_name}
          </h2>
          <FontAwesomeIcon
            icon={faEdit}
            className="edit-icon1"
            onClick={() => history.push("/user/profile/edit")}
          />
        </div>

        <div className="user-details-profile">
          <div className="user-detail-profile">
            <span className="user-detail-label">Email:</span>
            <span className="user-email">{user.email}</span>
          </div>

          <div className="user-detail-profile">
            <span className="user-detail-label">Username:</span>
            <span>{user.username}</span>
          </div>
          <div className="user-detail-profile">
            <span className="user-detail-label">Age:</span>
            <span>{user.age}</span>
          </div>
          <div className="user-detail-profile">
            <span className="user-detail-label">Country:</span>
            <span>{user.country}</span>
          </div>
          <div className="user-detail-profile about-me">
            <span className="user-detail-label">About Me:</span>
            <span>{user.about_me}</span>
          </div>
        </div>
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
