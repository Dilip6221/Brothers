import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../css/job-card.css";

const MyCarVault = () => {
  const { token } = useContext(UserContext);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("jobcard/customer/my-cars", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCars(res.data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-black text-white">
      <div className="py-5 text-center">
        <span className="about-badge">
          Car Vault
        </span>
        <div className="container text-center">
          <h3 className="section-title section-title-small">
            <span className="first-letter">M</span>y Car Vault
          </h3>
          <p className="text-secondary fs-5 mt-2">
            Your vehicles. Your service history. One place.
          </p>
        </div>
      </div>
      <div className="container pb-5">
        <div className="row">
          {cars.length === 0 ? (
            <div className="col-12 text-center">
              <div className="empty-blog-box">
                <div className="empty-icon">
                  <i className="bi bi-car-front-fill"></i>
                </div>
                <h3 className="text-white">
                  Your Garage is Waiting
                </h3>

                <p className="empty-text text-secondary">
                  No vehicles have been added to your Car Vault yet.
                  <br />
                  Start building your premium garage experience by adding your first car.
                </p>
                <Link to="/" className="btn mt-3 px-4 py-2 cont-btn">
                  Explore Services →
                </Link>
              </div>
            </div>
          ) : (
            cars.map((car) => (
              <div
                className="col-12 mb-4"
                key={car._id}
              >
                <div className="garage-card">
                  <div className="garage-card-bg"></div>
                  <div className="garage-left">
                    <div className="garage-status">
                      <span
                        className={`garage-dot ${car.isActive
                          ? "active"
                          : ""
                          }`}
                      ></span>
                      {car.isActive
                        ? "SERVICE ACTIVE"
                        : "SERVICE COMPLETE"}
                    </div>
                    <div className="garage-title">
                      <h2>
                        {car.brand}
                      </h2>
                      <h1>
                        {car.model}
                      </h1>
                    </div>
                    <div className="garage-reg">
                      {car.registrationNumber}
                    </div>
                    <div className="garage-specs">
                      <div className="garage-spec">
                        <small>COLOR</small>
                        <strong>
                          {car.color || "—"}
                        </strong>
                      </div>
                      <div className="garage-spec">
                        <small>YEAR</small>
                        <strong>
                          {car.year || "—"}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}

                  <div className="garage-right">
                    <div className="garage-icon-wrap">
                      <div className="garage-icon">
                        <i className="bi bi-car-front-fill"></i>
                      </div>
                    </div>
                    <Link
                      to={`/my-car-vault/${car._id}/job-card`}
                      className="garage-btn"
                    >
                      Enter Garage
                      <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCarVault;
