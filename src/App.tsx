import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './components/dashboard/Dashboard';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/vehicles/:id"
          element={
            <PrivateRoute>
              <VehicleDetailsPage />
            </PrivateRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;