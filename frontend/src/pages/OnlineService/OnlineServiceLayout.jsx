import React, { useEffect, useState } from "react";
import "../../css/onlineService.css";
import logo from "../../assets/images/brand.png";
import { FaSearch, FaUser, FaShoppingBag, FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const OnlineServiceLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    document.body.classList.add("admin-page");
    return () => document.body.classList.remove("admin-page");
  }, []);
  return (
    <header className="header-section">
      <div className="service-topbar">
        <div className="service-container">
          <div className="left">
            <img src={logo} alt="logo" className="service-logo" />
          </div>

          {/* SEARCH AREA */}
          <div className="center">
            <div className="city-select">
              Delhi-NCT
            </div>

            <div className="search-box">
              <input type="text" placeholder="Search: Batteries, Tyres..." />
              <FaSearch />
            </div>
          </div>
          <div className="right">
            <FaUser />
            <FaShoppingBag />
            <FaBars
              className="menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
            />
          </div>

        </div>
      </div>

      {/* MENU */}
      <div className={`menubar ${menuOpen ? "open" : ""}`}>
        <div className="service-container">
          <NavLink to="/car-tyres">Car Tyres</NavLink>
          <NavLink to="/bike-scooter-tyres">Bike / Scooter Tyres</NavLink>
          <NavLink to="/alloy-wheels">Alloy Wheels</NavLink>
          <NavLink to="/car-batteries">Car Batteries</NavLink>
          <NavLink to="/bike-scooter-batteries">Bike / Scooter Batteries</NavLink>
          <NavLink to="/accessories">Accessories</NavLink>
          <NavLink to="/wheel-covers">Wheel Covers</NavLink>
          <NavLink to="/b2b-customers">B2B Customers</NavLink>
        </div>
      </div>

    </header>
  );
};

export default OnlineServiceLayout;