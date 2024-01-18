/**
 * HomePage Component
 *
 * This component serves as the main page of the application. It features a dynamic background,
 * a greeting message based on the time of day, and a modal button for user registration. The component
 * utilizes custom hooks for dynamic background and greeting functionality. It also manages a menu state
 * for interactions within the component.
 *
 * The HomePage applies a 'no-scroll' class to the body element to disable scrolling when mounted and
 * removes it on unmount. Additionally, it handles click events outside of a specific UI element to close
 * the menu.
 */
import React, { useState, useEffect, useRef } from "react";
import {
  useDynamicBackground,
  useDynamicGreeting,
} from "../../assets/helpers/helpers";
import SignupFormModal from "../SignupFormModal";
import OpenModalButton from "../Modals/OpenModalButton";

import "./HomePage.css";

function HomePage() {
  const bgContainerRef = useRef(null);
  const ulRef = useRef(); // Reference for the menu element
  useDynamicBackground(bgContainerRef); // Custom hook for dynamic background
  const greeting = useDynamicGreeting(); // Custom hook for dynamic greeting based on time
  const [showMenu, setShowMenu] = useState(false); // State for menu visibility

  // Function to close the menu
  const closeMenu = () => setShowMenu(false);

  // useEffect to add and remove 'no-scroll' class on body
  useEffect(() => {
    document.body.classList.add("no-scroll"); // Disable scrolling on mount

    // Cleanup function to re-enable scrolling on unmount
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  // useEffect to close the menu when clicking outside of it
  useEffect(() => {
    if (!showMenu) return;

    // Function to close the menu when clicking outside
    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    // Add and remove click event listener
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);


  // Render the main page content, including the search bar and "Use My Location" button.
  return (
    <div className="home-container">
      <div ref={bgContainerRef} className="background-image-container"></div>
      <h1 className="greeting-h1">{greeting}</h1>

      {/* Modal button for user to signup */}
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
