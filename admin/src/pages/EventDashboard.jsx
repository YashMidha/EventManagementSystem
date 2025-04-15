import React from 'react';
import { Link } from 'react-router-dom';

const EventDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Event Management Dashboard</h1>
      <div className="flex flex-col items-center space-y-6">
        <Link
          to="/add"
          className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md w-1/2 text-center"
        >
          Add New Event
        </Link>
        <Link
          to="/remove"
          className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition duration-300 shadow-md w-1/2 text-center"
        >
          Remove Event
        </Link>
        <Link
          to="/search"
          className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition duration-300 shadow-md w-1/2 text-center"
        >
          Search Events
        </Link>
      </div>
    </div>
  );
};

export default EventDashboardPage;
