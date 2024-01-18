import React from "react";
import { BounceLoader } from "react-spinners";
import { ThreeDots } from 'react-loader-spinner';
import "./Spinner.css";

const Spinner = () => (
  <div className="spinner-container">
    <div className="custom-spinner">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ThreeDots color="#000000" height={80} width={80} timeout={3000} />
      </div>
      <p>Loading...</p>
    </div>
  </div>
);

export default Spinner;
