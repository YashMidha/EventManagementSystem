import React, { useState, useEffect } from 'react';
import { eventService } from '../services/EventService';
import { toast } from 'react-toastify';

const EventList = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const data = await eventService.getEvents();
      setEvents(data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleRemove = async (eventId) => {
    try {
      const response = await eventService.removeEvent(eventId);
      if (response.success){
        toast.success('Removed event!');
      } else{
        toast.error('Failed to remove event.');
      }
      fetchEvents();
    } catch (error) {
        toast.error('Failed to remove event.');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Event List</h2>
      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <h3 className="font-bold">{event.name}</h3>
              <p className="text-gray-500">{event.description}</p>
            </div>
            <button
              onClick={() => handleRemove(event.id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
