import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { logout } from "../../store/session";
import OpenModalButton from "../Modals/OpenModalButton";
import OpenModalMenuItem from "./OpenModalMenuItem";
import OpenShortModalButton from "../Modals/OpenShortModalButton";
import { useShortModal } from "../../context/ModalShort";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "./ProfileButton.css";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
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

    console.log("---Menu visibility changed:", showMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);
  const closeMenu = () => setShowMenu(false);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    setShowMenu(false); 
    history.push("/");
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className="profile-button-container">
      <button onClick={openMenu} className="profile-button">
        <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
      </button>

      <ul className={`${ulClassName} profile-btn-ul`} ref={ulRef}>
        {user ? (
          <>
            <li className="profile-info">
              <div className="username">{user.username}</div>
              <div className="email">{user.email}</div>
            </li>
            <li className="divider"></li>
            <li className="logout">
              <button className="logout-btn" onClick={handleLogout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
          <li className="profile-info">

            <OpenModalMenuItem
              // className="center-menu black-text-button"
              className="login-modal"
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
          </li>
          <li className="profile-info">
            <li className="divider"></li>

          </li>
            <li className="profile-info">
            <OpenModalMenuItem
              // className="center-menu black-text-button"
              className="signup-modal"
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
//   return (
//     <div className="profile-button-container">
//       <button onClick={openMenu} className="profile-button">
//         <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
//       </button>

//       <ul className={ulClassName} ref={ulRef}>
//         {user ? (
//           <>
//             <li className="profile-info">
//               <span className="username">{user.username}</span>
//               <span className="email">{user.email}</span>
//             </li>
//             <li className="logout">
//               <button onClick={handleLogout}>Log Out</button>
//             </li>
//           </>
//         ) : (
//           <>
//             <OpenModalMenuItem
//               className="center-menu black-text-button"
//               itemText="Log In"
//               onItemClick={closeMenu}
//               modalComponent={<LoginFormModal />}
//             />
//             <div className="divider"></div>
//             <OpenModalMenuItem
//               className="center-menu black-text-button"
//               itemText="Sign Up"
//               onItemClick={closeMenu}
//               modalComponent={<SignupFormModal />}
//             />
//           </>
//         )}
//       </ul>
//     </div>
//   );
// }

export default ProfileButton;

// import React, { useState, useEffect, useRef } from "react";
// import { useDispatch } from "react-redux";
// import { logout } from "../../store/session";
// import OpenModalButton from "../OpenModalButton";
// import LoginFormModal from "../LoginFormModal";
// import SignupFormModal from "../SignupFormModal";

// function ProfileButton({ user }) {
//   const dispatch = useDispatch();
//   const [showMenu, setShowMenu] = useState(false);
//   const ulRef = useRef();

//   const openMenu = () => {
//     if (showMenu) return;
//     setShowMenu(true);
//   };

//   useEffect(() => {
//     if (!showMenu) return;

//     const closeMenu = (e) => {
//       if (!ulRef.current.contains(e.target)) {
//         setShowMenu(false);
//       }
//     };

//     document.addEventListener("click", closeMenu);

//     return () => document.removeEventListener("click", closeMenu);
//   }, [showMenu]);

//   const handleLogout = (e) => {
//     e.preventDefault();
//     dispatch(logout());
//   };

//   const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
//   const closeMenu = () => setShowMenu(false);

//   return (
//     <>
//     <div className="profile-dropdown-container">
//       <button onClick={openMenu}>
//         <i className="fas fa-user-circle" />
//       </button>
//       <ul className={ulClassName} ref={ulRef}>
//         {user ? (
//           <>
//             <li>{user.username}</li>
//             <li>{user.email}</li>
//             <li>
//               <button onClick={handleLogout}>Log Out</button>
//             </li>
//           </>
//         ) : (
//           <>
//             <OpenModalButton
//               buttonText="Log In"
//               onItemClick={closeMenu}
//               modalComponent={<LoginFormModal />}
//             />

//             <OpenModalButton
//               buttonText="Sign Up"
//               onItemClick={closeMenu}
//               modalComponent={<SignupFormModal />}
//             />
//           </>
//         )}
//       </ul>

//     </div>
//     </>
//   );
// }

// export default ProfileButton;
