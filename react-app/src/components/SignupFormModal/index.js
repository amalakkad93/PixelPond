import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";
import GoogleAuthButton from "../GoogleAuthButton";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationObj, setValidationObj] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};

    if (!firstName) validationErrors.firstName = "First name is required";
    if (!lastName) validationErrors.lastName = "Last name is required";
    if (!email.includes("@")) validationErrors.email = "Must be a valid email";
    if (username.length <= 4)
      validationErrors.username = "Username must be greater than four characters";
    if (password.length < 6)
      validationErrors.password = "Password must be at least six characters";
    if (password !== confirmPassword)
      validationErrors.confirmPassword = "Passwords must match";
    if (isNaN(age) || age <= 0) validationErrors.age = "Age must be a positive number";

    setValidationObj(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const data = await dispatch(
        signUp(firstName, lastName, age, username, email, password)
      );
      if (data) {
        setValidationObj({ general: data });
      } else {
        closeModal();
        // push("/posts/current"); 
      }
    }
  };

  return (
    <>
      <div className="sign-up-container">
        <form className="sign-up-form" onSubmit={handleSubmit}>
          <h1 className="sign-up-h1">Sign Up</h1>
          <div className="sign-up-google-div">
            <GoogleAuthButton />
          </div>
          <div className="sign-up-input-boxes">
            {/* Email Input */}
            <input
              className="sign-up-input"
              type="text"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
              />
              {validationObj.email && <p className="error-message">{validationObj.email}</p>}

            {/* Username Input */}
            <input
              className="sign-up-input"
              type="text"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
              />
              {validationObj.username && <p className="error-message">{validationObj.username}</p>}

            {/* First Name Input */}
            <input
              className="sign-up-input"
              type="text"
              value={firstName}
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
              required
              />
              {validationObj.firstName && <p className="error-message">{validationObj.firstName}</p>}

            {/* Last Name Input */}
            <input
              className="sign-up-input"
              type="text"
              value={lastName}
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}
              required
              />
              {validationObj.lastName && <p className="error-message">{validationObj.lastName}</p>}

            {/* Age Input */}
            <input
              className="sign-up-input"
              type="text"
              value={age}
              placeholder="Age"
              onChange={(e) => setAge(e.target.value)}
              required
              />
              {validationObj.age && <p className="error-message">{validationObj.age}</p>}

            {/* Password Input */}
            <input
              className="sign-up-input"
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              />
              {validationObj.password && <p className="error-message">{validationObj.password}</p>}

            {/* Confirm Password Input */}
            <input
              className="sign-up-input"
              type="password"
              value={confirmPassword}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              />
              {validationObj.confirmPassword && <p className="error-message">{validationObj.confirmPassword}</p>}

            {/* Submit Button */}
            <button className="sign-up-btn" type="submit">Sign Up</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default SignupFormModal;

// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useModal } from "../../context/Modal";
// import { signUp } from "../../store/session";
// import GoogleAuthButton from "../GoogleAuthButton";
// import "./SignupForm.css";

// function SignupFormModal() {
//   const dispatch = useDispatch();
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [age, setAge] = useState("");
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [errors, setErrors] = useState([]);
//   const { closeModal } = useModal();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (password === confirmPassword) {
//       const data = await dispatch(
//         signUp(firstName, lastName, age, username, email, password)
//       );
//       if (data) {
//         setErrors(data);
//       } else {
//         closeModal();
//       }
//     } else {
//       setErrors([
//         "Confirm Password field must be the same as the Password field",
//       ]);
//     }
//   };

//   return (
//     <>
//       <div className="sign-up-container">
//         <form className="sign-up-form" onSubmit={handleSubmit}>
//           <ul className="sign-up-ul">
//             {errors.map((error, idx) => (
//               <li key={idx}>{error}</li>
//               ))}
//           </ul>
//               <h1 className="sign-up-h1">Sign Up</h1>
//           <div className="sign-up-google-div">
//               <GoogleAuthButton />
//           </div>
//           <div className="sign-up-input-boxes">
//             <input
//               className="sign-up-input"
//               type="text"
//               value={email}
//               placeholder="Email"
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />

//             <input
//               className="sign-up-input"
//               type="text"
//               value={username}
//               placeholder="Username"
//               onChange={(e) => setUsername(e.target.value)}
//               required
//             />

//             <input
//               className="sign-up-input"
//               type="text"
//               value={firstName}
//               placeholder="First Name"
//               onChange={(e) => setFirstName(e.target.value)}
//               required
//             />

//             <input
//               className="sign-up-input"
//               type="text"
//               value={lastName}
//               placeholder="Last Name"
//               onChange={(e) => setLastName(e.target.value)}
//               required
//             />

//             <input
//               className="sign-up-input"
//               type="text"
//               value={age}
//               placeholder="Age"
//               onChange={(e) => setAge(e.target.value)}
//               required
//             />

//             <input
//               className="sign-up-input"
//               type="password"
//               value={password}
//               placeholder="Password"
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />

//             <input
//               className="sign-up-input"
//               type="password"
//               value={confirmPassword}
//               placeholder="Confirm Password"
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//             />
//           <button className="sign-up-btn" type="submit">
//             Sign Up
//           </button>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// }

// export default SignupFormModal;
