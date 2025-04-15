import React, { useEffect, useState } from 'react'
import { AppContextProvider } from './context/AppContext.jsx';
import AppRoutes from './routes/AppRoute.jsx';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (        
    <AppContextProvider>
        <ToastContainer autoClose={3000} />
        <AppRoutes /> 
    </AppContextProvider>
  )
}

export default App