import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';
import LoginPage from '../pages/Login.jsx';
import SignupPage from '../pages/Signup.jsx';
import AddEventPage from '../pages/AddEvent.jsx';
import EventList from '../pages/EventList.jsx';
import ParticipantsList from '../pages/ParticipantsList.jsx';
import SearchPage from '../pages/Search.jsx';
import EventDashboardPage from '../pages/EventDashboard.jsx';

const AppRoutes = () => {
    const { isAuthenticated } = useAppContext();

    return (
        <Routes>
            <Route
                exact
                path="/"
                element={isAuthenticated ? <EventDashboardPage /> : <Navigate to="/login" />}
            />

            <Route
                exact
                path="/search"
                element={isAuthenticated ? <SearchPage /> : <Navigate to="/login" />}
            />

            <Route
                exact
                path="/remove"
                element={isAuthenticated ? <EventList /> : <Navigate to="/login" />}
            />
            
            <Route
                exact
                path="/add"
                element={isAuthenticated ? <AddEventPage /> : <Navigate to="/login" />}
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
                path="/event/:eventId"
                element={isAuthenticated ? <ParticipantsList /> : <Navigate to="/login" />}
            />


        </Routes>
    );
};

export default AppRoutes;