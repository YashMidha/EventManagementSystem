import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState(null); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get(`${backendUrl}/auth/login/success`, {
        withCredentials: true
      });
      setUser(response.data.user);
      setIsAuthenticated(!!response.data.user);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    window.open(`${backendUrl}/auth/logout`, '_self');
  };

  const loginWithLocal = async (email, password) => {
    try {
      const response = await axios.post(`${backendUrl}/auth/login`, {
        email,
        password
      }, { withCredentials: true });
      
      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
      else{
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Login failed:', error.response.data.message);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const registerWithLocal = async (email, password, name) => {
    try {
      const response = await axios.post(`${backendUrl}/auth/register`, {
        email,
        password,
        name
      }, { withCredentials: true });
      
      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
      else{
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Login failed:', error.response.data.message);
      setUser(null);
      setIsAuthenticated(false);
  };

}

  return (
    <AppContext.Provider value={{ 
      user, 
      isAuthenticated,
      backendUrl,
      logout, 
      checkLoginStatus,
      loginWithLocal,
      registerWithLocal,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppContext;