import { useEffect, useState } from "react";
import ServiceSlider from "../pages/ServiceSlider.jsx";
import ServiceCard from "../pages/ServiceCard.jsx";
import WhyChooseUs from "./WhyChooseUs.jsx";



const Home = () => {

  return (
    <>
    <ServiceSlider />
    <ServiceCard />
    <WhyChooseUs />
    </>

  );
};

export default Home;