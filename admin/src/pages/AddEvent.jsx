import React, { useState } from 'react';
import { eventService } from '../services/EventService';
import { toast } from 'react-toastify';

const AddEventPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    date: '',
    time: '',
    seats: '',
    category: '',
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, value));
    try {
      const response = await eventService.addEvent(formDataToSend);
      if (response.success){
        toast.success('Event added successfully!');
        setFormData({
            name: '',
            description: '',
            location: '',
            date: '',
            time: '',
            seats: '',
            category: '',
            image: null,
          });
      }
      else{
        toast.error('Failed to add event.');
      }
    } catch (error) {
      toast.error('Failed to add event.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded-lg shadow-md w-96" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Add Event</h2>
        <input
          type="text"
          name="name"
          placeholder="Event Name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="number"
          name="seats"
          placeholder="Seats"
          value={formData.seats}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Add Event
        </button>
      </form>
    </div>
  );
};

export default AddEventPage;
