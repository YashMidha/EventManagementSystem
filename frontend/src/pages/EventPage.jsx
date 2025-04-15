import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { eventService, userEventService } from "../services/EventService";
import { ChevronLeftIcon } from "lucide-react";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventData = await eventService.getEventDetails(id);
        setEvent(eventData.event);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    const checkRegistrationStatus = async () => {
      try {
        const registered = await userEventService.isRegistered(id);
        setIsRegistered(registered.isRegistered);
      } catch (error) {
        console.error("Error checking registration status:", error);
      }
    };

    fetchEventDetails();
    checkRegistrationStatus();
  }, [id]);

  const handleRegister = async () => {
    try {
      await userEventService.registerForEvent(id);
      setIsRegistered(true);
    } catch (error) {
      console.error("Error registering for event:", error);
    }
  };

  const handleUnregister = async () => {
    try {
      await userEventService.unregisterFromEvent(id);
      setIsRegistered(false);
    } catch (error) {
      console.error("Error unregistering from event:", error);
    }
  };

  if (!event) {
    return <p className="text-center text-gray-500">Loading event details...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 ml-auto"
        >
          <ChevronLeftIcon className="w-6 h-6 mr-2" />
          Go Back
        </button>
      </div>

      {/* Event Image */}
      <div className="w-full flex justify-center">
        <img
          src={event.image_url}
          alt={event.name}
          className="w-full max-w-2xl h-80 object-cover rounded-lg shadow-md"
        />
      </div>

      <div className="mt-6 p-6 border rounded-lg shadow-md bg-white">
        <p className="text-gray-700"><strong>Description:</strong> {event.description}</p>
        <p className="text-gray-700 mt-2"><strong>Location:</strong> {event.location}</p>
        <p className="text-gray-700 mt-2"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p className="text-gray-700 mt-2"><strong>Time:</strong> {event.time}</p>
        <p className="text-gray-700 mt-2"><strong>Category:</strong> {event.categories}</p>
        <p className="text-gray-700 mt-2"><strong>Available Seats:</strong> {event.available_seats}</p>
      </div>

      <div className="mt-6 text-center">
        {isRegistered ? (
          <button
            onClick={handleUnregister}
            className="bg-red-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-red-700 transition"
          >
            Unregister from Event
          </button>
        ) : (
          <button
            onClick={handleRegister}
            className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition"
          >
            Register for Event
          </button>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
