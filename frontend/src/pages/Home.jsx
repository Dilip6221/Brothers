import React from 'react';
import ppf from '../assets/images/defender.png';
import ServiceCard from './ServiceCard';

const Home = () => {
  return (
    <>
      {/* <section
        className="d-flex justify-content-center align-items-center bg-black"
        style={{
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <img
          src={ppf}
          alt="Defender PPF Full View"
          className="img-fluid"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
          }}
        />
      </section> */}
      <ServiceCard />

      {/* <section className="container py-5">
        <h2 className="text-center mb-4">Premium Car Protection</h2>
        <p className="text-center">
          We provide world-class paint protection film (PPF), ceramic coating, and detailing services.
        </p>
      </section> */}
    </>
  );
};

export default Home;
