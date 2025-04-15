import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { eventService } from '../services/EventService';

const ParticipantsListPage = () => {
  const { eventId } = useParams();
  const [participants, setParticipants] = useState([]);
  
  const fetchParticipants = async () => {
    try {
      const data = await eventService.listUsersForEvent(eventId);
      if (data.participants) setParticipants(data.participants);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [eventId]);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Participants List</h2>

      {participants.length > 0 ? (
        <ul className="space-y-4">
          {participants.map((participant) => (
            <li
              key={participant.user_id}
              className="bg-white p-4 rounded-lg shadow"
            >
              <div>
                <h3 className="font-bold">{participant.user_name}</h3>
                <p className="text-gray-500">{participant.user_email}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow text-gray-500">
          No participants found
        </div>
      )}
    </div>
  );
};

export default ParticipantsListPage;
