import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import PopupsModal from "../Modals/PopupsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCameraRetro,
  faUserCircle,
  faImages,
} from "@fortawesome/free-solid-svg-icons";

import logo from "../../assets/images/logo.png";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // const toggleModal = () => setShowModal(!showModal);
  const toggleModal = () => {
    console.log("---Toggling modal:", !showModal);
    setShowModal(!showModal);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <NavLink exact to="/posts/all" className="navbar-logo">
          <img src={logo} alt="logo" className="logo-img" />
        </NavLink>

        <ul className="navbar-links">
          <li>
            <NavLink to="/explore" activeClassName="active">
              <FontAwesomeIcon icon={faCameraRetro} />
              Explore
            </NavLink>
          </li>

          {sessionUser && (
            <li className="pop-modal-trigger" onClick={toggleModal}>
              <span className="white-icon">You</span>

              {/* <FontAwesomeIcon icon={faUserCircle} className="white-icon" /> */}

              {/* <span>{sessionUser.username}</span> */}
              {showModal && (
                <PopupsModal
                  showModal={showModal}
                  onClose={() => setShowModal(false)}
                />
              )}
            </li>
          )}

          {isLoaded && (
            <ul className="navBar-far-right">
              <li>
                <ProfileButton user={sessionUser} showMenu={showMenu} />
              </li>
            </ul>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
