import React from "react";
import { useSelector } from "react-redux";
import UserNavigationBar from "../Navigation/UserNavigationBar";
import { selectUserInfo } from "../../store/selectors";
import { LazyLoadImage } from "react-lazy-load-image-component";
import defult_banner_image from "../../assets/images/defult_banner_image.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";


const BannerNavbar = ({
  userInfo,
  mode,
  albumTitle,
  onAboutClick,
  showAbout,
  albumCount,
  images,
  profilePhoto,
  userName
}) => {
  console.log("🚀 ~ file: BannerNavbar.js:22 ~ images:", images)
  // Check if the essential data (profilePhoto and userName) are available
  const isDataAvailable = profilePhoto && userName;
  if (!isDataAvailable) return null;
  return (
    <div className="banner-container">
      {isDataAvailable ? (
        // Render the banner only if data is available
        <div className="banner">
          {/* Render images if available, else default banner image */}
          {images && images[0] ? (
            <LazyLoadImage
              src={images[0]}
              effect="blur"
              className="banner-image"
              width={"100%"}
              height={"300px"}
            />
          ) : (
            <LazyLoadImage
              src={defult_banner_image}
              effect="blur"
              className="banner-image"
              width={"100%"}
              height={"300px"}
            />
          )}

          <div className={mode === "ownerPhotoStream" ? "owner-details" : "user-details"}>
            <div className="profile-picture-container">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="profile-picture" />
              ) : (
                <FontAwesomeIcon icon={faUserCircle} className="profile-picture" />
              )}
            </div>

            <div className="user-name">
              <h1>{userName}</h1>
            </div>
          </div>
        </div>
      ) : (

        <div className="banner-loading">Loading...</div>
      )}
    </div>
  );
};

export default BannerNavbar;
