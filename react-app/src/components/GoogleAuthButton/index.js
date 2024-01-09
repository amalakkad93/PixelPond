import React from 'react';
import '../LoginFormModal/LoginForm.css'
import './GoogleAuthButton.css'

function GoogleAuthButton() {

  const BASE_URL="https://pixelpond-rhct.onrender.com";

  const backendBaseUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : BASE_URL;

  const oauthLoginUrl = `${backendBaseUrl}/api/google_auth/oauth_login`;


  return (
    <button className="google-auth-btn" onClick={() => window.location.href = oauthLoginUrl}>
      <img
        className="google-login-icon"
        src="https://img.icons8.com/color/48/000000/google-logo.png"
        alt="Google logo"
      />
      <span className="google-login-text">Login with Google</span>
    </button>
  );
}

export default GoogleAuthButton;
