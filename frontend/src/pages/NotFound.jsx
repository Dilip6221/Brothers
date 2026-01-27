import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="bg-black text-white">
      <div className="container pb-5">
        <div className="row">
          <div className="col-12 text-center py-5">
            <div className="empty-blog-box">
              <div className="empty-icon">
                <i className="bi bi-journal-x"></i>
              </div>
              <h3 className="mt-3 ">404 - Page Not Found</h3>
              <p className="empty-text">
                Looks like this page took a wrong turn.
                <br />
                Let’s get you back on the right road!
              </p>
              <Link to="/" className="btn mt-2" style={{ background: "#ff6600", fontWeight: 500, }}>
                Go to Homepage →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
