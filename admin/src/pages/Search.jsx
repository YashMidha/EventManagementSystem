import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/EventService';

const SearchPage = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const data = await eventService.getEvents();
      setEvents(data.events);
      setFilteredEvents(data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = events.filter((event) =>
      event.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Search Events</h2>

      <input
        type="text"
        placeholder="Search events..."
        value={searchQuery}
        onChange={handleSearch}
        className="border border-gray-300 px-4 py-2 rounded-lg mb-4 w-full"
      />

      <ul className="space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <li
              key={event.id}
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-200"
              onClick={() => handleEventClick(event.id)}
            >
              <div>
                <h3 className="font-bold">{event.name}</h3>
                <p className="text-gray-500">{event.description}</p>
              </div>
            </li>
          ))
        ) : (
          <li className="bg-white p-4 rounded-lg shadow text-gray-500">
            No events found
          </li>
        )}
      </ul>
    </div>
  );
};

export default SearchPage;
