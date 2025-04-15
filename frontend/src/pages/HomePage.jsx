import React, { useState, useEffect } from 'react';
import { LogOut, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/EventService';
import { useAppContext } from '../context/AppContext';
import EventCard from '../components/EventCard';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryList = await eventService.getCategories();
        setCategories(categoryList.categories || []);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      name: searchTerm,
      category: category,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white shadow-md rounded-lg overflow-hidden flex items-center">
      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow p-3 text-gray-700 focus:outline-none"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="bg-gray-100 p-3 border-l border-gray-200"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
      <button type="submit" className="bg-blue-500 text-white px-4 py-3 hover:bg-blue-600 transition-colors">
        Search
      </button>
    </form>
  );
};

const ProfileDropdown = ({ onLogout, userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const generateBackgroundColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const initials = getInitials(userName);
  const bgColor = generateBackgroundColor(userName);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full text-white flex items-center justify-center font-bold text-lg shadow-md hover:opacity-90 transition-opacity"
        style={{ backgroundColor: bgColor }}
      >
        {initials}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="p-3 border-b text-center">
            <p className="font-semibold">{userName}</p>
          </div>
          <button 
            onClick={() => {
              navigate('/registered-events');
              setIsOpen(false);
            }}
            className="w-full flex items-center p-3 hover:bg-gray-100 text-left"
          >
            <Calendar className="mr-2" size={18} />
            Registered Events
          </button>
          <button 
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="w-full flex items-center p-3 hover:bg-gray-100 text-left text-red-500"
          >
            <LogOut className="mr-2" size={18} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searched, setSearched] = useState(false);
  const { user, logout } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchEvents = async () => {
      try {
        const eventList = await eventService.getEvents();
        const recommendedList = await eventService.getRecommendedEvents();

        setEvents(eventList.events);
        setFilteredEvents(eventList.events);
        setRecommendedEvents(recommendedList.events);
      } catch (error) {
        console.error('Failed to fetch events', error);
      }
    };

    fetchEvents();
  }, [user, navigate]);

  const handleSearch = async (filters) => {
    try {
      const searchResults = await eventService.searchEvents(filters);
      setFilteredEvents(searchResults.events);
      setSearched(true);
    } catch (error) {
      console.error('Search failed', error);
    }
  };

  const resetSearch = () => {
    setFilteredEvents(events);
    setSearched(false);
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Event Explorer</h1>
        <ProfileDropdown onLogout={logout} userName={user.name || 'User'} />
      </header>

      <SearchBar onSearch={handleSearch} />

      {searched ? (
        <section>
          <h2 className="pt-8 text-2xl font-bold mb-4">Search Results</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <p className="text-gray-500">No events found for your search.</p>
            )}
          </div>
          <button onClick={resetSearch} className="mt-4 text-blue-500 underline">
            Back to All Events
          </button>
        </section>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="pt-5 text-2xl font-bold mb-4">Recommended Events</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {recommendedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="pt-16 text-2xl font-bold mb-4">Recent Events</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default HomePage;
