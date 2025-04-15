import React, { useState, useEffect } from 'react';
import { userEventService } from '../services/EventService';
import { useNavigate } from 'react-router-dom';
import { CalendarX, MapPin, Clock, ChevronLeft } from 'lucide-react';

const RegisteredEventsPage = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const events = await userEventService.getRegisteredEvents();
        setRegisteredEvents(events);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch registered events');
        setLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, []);

  const handleUnregister = async (eventId) => {
    try {
      await userEventService.unregisterFromEvent(eventId);
      // Remove the event from the list after successful unregistration
      setRegisteredEvents(prevEvents => 
        prevEvents.filter(event => event.event_id !== eventId)
      );
    } catch (err) {
      setError('Failed to unregister from the event');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Registered Events</h1>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4">
          <ChevronLeft className="mr-2" />
          Go Back
        </button>
      </div>
      
      {registeredEvents.length === 0 ? (
        <div className="text-center text-gray-500">
          <CalendarX className="mx-auto mb-4" size={64} />
          <p>You haven't registered for any events yet.</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Explore Events
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registeredEvents.map((event) => (
            <div 
              key={event.event_id} 
              className="bg-white shadow-md rounded-lg overflow-hidden transform transition-all hover:scale-105"
            >
              {event.image_url ? (
                <img 
                  src={event.image_url} 
                  alt={event.name} 
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
                <p className="text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                
                <div className="flex items-center text-gray-500 mb-2">
                  <Clock className="mr-2" size={16} />
                  <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                </div>
                
                <div className="flex items-center text-gray-500 mb-4">
                  <MapPin className="mr-2" size={16} />
                  <span>{event.location}</span>
                </div>
                
                {event.category && (
                  <div className="mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {event.category}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Registered on: {new Date(event.registered_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleUnregister(event.event_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Unregister
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegisteredEventsPage;