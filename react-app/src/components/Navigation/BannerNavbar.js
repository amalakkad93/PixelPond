import React from "react";
import { useSelector } from "react-redux";
import UserNavigationBar from "../Navigation/UserNavigationBar";
import { selectPostUserInfo } from "../../store/selectors";
import { LazyLoadImage } from "react-lazy-load-image-component";
import defult_banner_image1 from "../../assets/images/defult_banner_image.png";
import defult_banner_image2 from "../../assets/images/defult_banner_image2.png";
import defult_banner_image3 from "../../assets/images/defult_banner_image3.png";
import defult_banner_image4 from "../../assets/images/defult_banner_image4.png";
import profileImage1 from "../../assets/images/profileImage1.png";
import profileImage2 from "../../assets/images/profileImage2.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../Spinner";

import "./BannerNavbar.css";

const BannerNavbar = ({ userInfo }) => {
  // Check if the essential data (profilePhoto and userName) are available
  const isDataAvailable = userInfo && (userInfo.profile_picture || userInfo.first_name || userInfo.last_name);

  const profilePhoto = userInfo?.profile_picture;
  const bannerPhoto = userInfo?.banner_picture;
  const userName = `${userInfo?.first_name || ''} ${userInfo?.last_name || ''}`;

   // Function to get a random default banner image
   const getRandomDefaultBannerImage = () => {
    const images = [defult_banner_image1, defult_banner_image2, defult_banner_image3,defult_banner_image4];
    return images[Math.floor(Math.random() * images.length)];
  };
  const getRandomDefaultImage = () => {
    const images = [profileImage1, profileImage2];
    return images[Math.floor(Math.random() * images.length)];
  };


  // const bannerPhoto = userInfo?.banner_picture || getRandomDefaultBannerImage();

  if(!isDataAvailable) return null;
  return (
    <div className="banner-nav-container">
      {isDataAvailable ? (
        // Render the banner only if data is available
        <div className="banner-nav">
          {/* Render images if available, else default banner image */}
          {bannerPhoto && bannerPhoto ? (
              <LazyLoadImage
              src={bannerPhoto}
              effect="blur"
              className="banner-nav-image"
              width={"100%"}
              height={"200px"}
            />
          ) : (
            <LazyLoadImage
              src={getRandomDefaultBannerImage()}
              effect="blur"
              className="banner-nav-image"
              width={"100%"}
              height={"200px"}
            />
          )}

          {/* <div className="banner-nav-user-details"> */}
          <div className="banner-nav-user-details">
            <div className="banner-nav-profile-picture-container">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="banner-nav-profile-picture"
                />
              ) : (
                // <FontAwesomeIcon
                //   icon={faUserCircle}
                //   className="banner-nav-profile-picture"
                // />
                <img className="banner-nav-profile-picture" src={ getRandomDefaultImage()} alt="Profile" />
              )}
            </div>

            <div className="banner-nav-user-name">
              <h1>{userName.trim() || 'User Name'}</h1>
            </div>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default BannerNavbar;
