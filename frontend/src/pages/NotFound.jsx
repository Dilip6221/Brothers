// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import carImage from "../assets/images/car-not-found.jpg";

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-graphic">
        <img src={carImage} alt="404 Error - Tow Truck" />
      </div>
      <h1>Oops! Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="home-button">Go Back Home</Link>
    </div>
  );
};

export default NotFound;
