import React, { useState, useEffect } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import GoogleAuthButton from "../GoogleAuthButton";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const { closeModal } = useModal();
  const [validationObj, setValidationObj] = useState({});
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  useEffect(() => {
    setIsButtonEnabled(usernameOrEmail.trim() !== "" && password !== "");
  }, [usernameOrEmail, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!usernameOrEmail.trim()) {
      validationErrors.usernameOrEmail = "Username or Email is required";
    }
    if (!password) {
      validationErrors.password = "Password is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setValidationObj(validationErrors);
      return;
    }

    setValidationObj({});
    await loginAndHandleErrors(usernameOrEmail, password);
  };

  const loginAndHandleErrors = async (username, pwd) => {
    const response = await dispatch(login(username, pwd));

    if (response && Array.isArray(response) && response.length > 0) {
      const errorMessage = response[0];
      let formattedError = {};
      const errorParts = errorMessage.split(":");
      if (errorParts.length === 2) {
        const field = errorParts[0].trim().replace(/_/g, " ").toLowerCase();
        const message = errorParts[1].trim();
        formattedError[field] = message;
      } else {
        formattedError.general = "An error occurred. Please try again.";
      }
      setValidationObj(formattedError);
    } else {
      closeModal();
    }
  };

  const handleDemoUserClick = async () => {
    setUsernameOrEmail("demo@aa.io");
    setPassword("password");
    await loginAndHandleErrors("demo@aa.io", "password");
  };

  return (
    <>
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-h1">Log In</h1>
        <input
          className={`login-input ${
            validationObj["username or email"] ? "error" : ""
          }`}
          type="text"
          value={usernameOrEmail}
          placeholder="Username or Email"
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          required
        />
        {validationObj["username or email"] && (
          <p className="error-message">{validationObj["username or email"]}</p>
        )}

        <input
          className={`login-input ${validationObj.password ? "error" : ""}`}
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {validationObj.password && (
          <p className="error-message">{validationObj.password}</p>
        )}
        <button
          className={`login-btn ${!isButtonEnabled ? "disabled-btn" : ""}`}
          type="submit"
          disabled={!isButtonEnabled}
        >
          Log In
        </button>
        <button
          className="demo-user-btn"
          type="button"
          onClick={handleDemoUserClick}
        >
          Demo User
        </button>
        <GoogleAuthButton />
      </form>
    </>
  );
}

export default LoginFormModal;

// function LoginFormModal() {
//   const dispatch = useDispatch();
//   const [usernameOrEmail, setUsernameOrEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState([]);
//   const { closeModal } = useModal();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = await dispatch(login(usernameOrEmail, password));
//     if (data) {
//       setErrors(data);
//     } else {
//       closeModal();
//     }
//   };

//   return (
//     <>
//       <form className="login-form" onSubmit={handleSubmit}>
//       <h1 className="login-h1">Log In</h1>
//         <ul className="login-ul">
//           {errors.map((error, idx) => (
//             <li key={idx}>{error}</li>
//           ))}
//         </ul>

//           <input
//             className="login-input"
//             type="text"
//             value={usernameOrEmail}
//             placeholder="Username or Email"
//             onChange={(e) => setUsernameOrEmail(e.target.value)}
//             required
//           />

//           <input
//             className="login-input"
//             type="password"
//             value={password}
//             placeholder="Password"
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//         <button className="login-btn" type="submit">
//           Log In
//         </button>
//         <button
//           className="demo-user-btn"
//           type="button"
//           onClick={(e) => {
//             setUsernameOrEmail("demo@aa.io");
//             setPassword("password");
//           }}
//         >
//           Demo User
//         </button>

//         <GoogleAuthButton />
//       </form>
//     </>
//   );
// }

// export default LoginFormModal;
