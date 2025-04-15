import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="p-8 md:w-2/3 flex flex-col items-start justify-center text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Welcome to <span className="text-blue-600">MEMS</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your one-stop platform to discover and register for exciting events near you. 
          Explore a variety of events tailored just for you, and never miss out on the fun!
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
