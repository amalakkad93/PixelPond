import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import GoogleAuthButton from "../GoogleAuthButton"
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

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
      <form className="login-form" onSubmit={handleSubmit}>
      <h1 className="login-h1">Log In</h1>
        <ul className="login-ul">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
       
          <input
            className="login-input"
            type="text"
            value={usernameOrEmail}
            placeholder="Username or Email"
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
          />

          <input
            className="login-input"
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

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

        <GoogleAuthButton />
      </form>
    </>
  );
}

export default LoginFormModal;
