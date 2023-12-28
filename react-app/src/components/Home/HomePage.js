import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  useDynamicBackground,
  useDynamicGreeting,
} from "../../assets/helpers/helpers";
import SignupFormModal from "../SignupFormModal";
import OpenModalButton from "../Modals/OpenModalButton";

import "./HomePage.css";

function HomePage() {
  const bgContainerRef = useRef(null);
  useDynamicBackground(bgContainerRef);
  const greeting = useDynamicGreeting();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);
  const closeMenu = () => setShowMenu(false);

  // Render the main page content, including the search bar and "Use My Location" button.
  return (
    <div className="home-container">
      <div ref={bgContainerRef} className="background-image-container"></div>
      <h1 className="Search-bar-title">{greeting}</h1>
      {/* <SearchBar onPlaceSelected={handlePlaceSelected} /> */}

      <OpenModalButton
        className="home-page-modal"
        // className="signup-modal-home-page"
        buttonText="Start for Free"
        onItemClick={closeMenu}
        modalComponent={<SignupFormModal />}
      />
    </div>
  );
}

export default HomePage;
