import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';
import HomePage from '../pages/HomePage.jsx';
import LandingPage from '../pages/LandingPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisteredEventsPage from '../pages/RegisteredEventsPage.jsx';
import EventDetails from '../pages/EventPage.jsx';
import SignupPage from '../pages/SignupPage.jsx';

const AppRoutes = () => {
  const { isAuthenticated } = useAppContext();

  return (
    <Routes>
      <Route
        exact
        path="/"
        element={isAuthenticated ? <HomePage /> : <Navigate to="/welcome" />}
      />
      
      <Route
        exact
        path="/welcome"
        element={isAuthenticated ? <Navigate to="/" /> : <LandingPage />}
      />

      <Route
        exact
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
      />

      <Route
        exact
        path="/register"
        element={isAuthenticated ? <Navigate to="/" /> : <SignupPage />}
      />

      <Route
        exact
        path="/registered-events"
        element={isAuthenticated ? <RegisteredEventsPage /> : <Navigate to="/welcome" />}
      />

      <Route
        exact
        path="/event/:id"
        element={isAuthenticated ? <EventDetails /> : <Navigate to="/welcome" />}
      />

    </Routes>
  );
};

export default AppRoutes;