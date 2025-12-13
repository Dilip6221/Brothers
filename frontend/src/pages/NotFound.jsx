import React from 'react';
import { Link } from 'react-router-dom';
import carImage from "../assets/images/car-not-found.jpg";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 to-black opacity-70"></div>

      {/* Blurred circle lights */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-red-500/20 blur-[120px] rounded-full"></div>

      {/* Car Image */}
     
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-4xl md:text-6xl font-bold text-center tracking-widest drop-shadow-lg">
        404 - Page Not Found
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-gray-300 text-lg md:text-xl mt-4 text-center max-w-2xl">
        The page you're looking for doesn’t exist, got removed, or is currently under maintenance.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <Link
          to="/"
          className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 transition-all px-8 py-3 rounded-xl text-white text-lg font-semibold shadow-lg shadow-blue-800/50">
          Go Back Home
        </Link>
      </motion.div>
    </div>
  );
}
