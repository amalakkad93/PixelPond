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
  
  useEffect(() => {
    // When HomePage mounts
    document.body.classList.add('no-scroll');

    // Cleanup function for when HomePage unmounts
    return () => {
        document.body.classList.remove('no-scroll');
    };
}, []);

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
      <h1 className="greeting-h1">{greeting}</h1>
      <OpenModalButton
        className="home-page-modal"
        buttonText="Start for Free"
        onItemClick={closeMenu}
        modalComponent={<SignupFormModal />}
      />
    </div>
  );
}

export default HomePage;
