import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const backendBaseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000"
      : "https://gotham-eat.onrender.com";

  const oauthLoginUrl = `${backendBaseUrl}/api/auth/oauth_login`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(usernameOrEmail, password));
    if (data) {
      setErrors(data);
    } else {
      closeModal();
    }
  };

  return (
    <>
      <h1 className="login-h1">Log In</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <ul className="login-ul">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          <input
            className="login-input"
            type="text"
            value={usernameOrEmail}
            placeholder="Username or Email"
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            className="login-input"
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="login-btn" type="submit">
          Log In
        </button>
        <button
          className="demo-user-btn"
          type="button"
          onClick={(e) => {
            setUsernameOrEmail("demo@aa.io");
            setPassword("password");
          }}
        >
          Demo User
        </button>

        <button onClick={() => (window.location.href = oauthLoginUrl)}>
          <img
            className="google-login-icon"
            src="https://img.icons8.com/color/48/000000/google-logo.png"
            alt="Google logo"
          />
          <span className="google-login-text">Login with Google</span>
        </button>
      </form>
    </>
  );
}

export default LoginFormModal;
