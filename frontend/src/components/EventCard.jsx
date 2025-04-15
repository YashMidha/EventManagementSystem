import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <Link to={`/event/${event.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <img 
          src={event.image_url || '/placeholder-event.jpg'} 
          alt={event.name} 
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2">{event.name}</h3>
          <p className="text-gray-600 mb-2">
            {event.date} | {event.time}
          </p>
          <p className="text-gray-500 mb-2">{event.location}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-600">
              {event.category}
            </span>
            <span className="text-sm text-gray-500">
              {event.available_seats} seats left
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;