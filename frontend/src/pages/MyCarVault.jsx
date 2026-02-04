import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const MyCarVault = () => {
  const { token } = useContext(UserContext);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/jobcard/customer/my-cars`, {
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
          {cars.map(car => (
            console.log(car),
            <div className="col-lg-6 col-md-6 col-sm-12 mb-4" key={car._id}>
              <div className="vault-card">

                <div className="vault-card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h4 className="text-white mb-1">
                        {car.brand} {car.model}
                      </h4>
                      <p className="text-secondary mb-0">
                        Reg No: {car.registrationNumber}
                      </p>
                    </div>
                    <span className="vault-chip">{car.isActive ? "Active" : "Complete"}</span>
                  </div>
                  <div className="vault-divider"></div>
                  <div className="d-flex justify-content-between mt-3">
                    <div>
                      <small className="text-secondary">Color</small>
                      <p className="text-white mb-0 text-capitalize">
                        {car.color || "—"}
                      </p>
                    </div>
                    <div>
                      <small className="text-secondary">Year</small>
                      <p className="text-white mb-0">
                        {car.year || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="text-end mt-4">
                    <Link
                      to={`/my-car-vault/${car._id}/job-card`}
                      className="vault-btn"
                    >
                      View Job Card
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCarVault;
