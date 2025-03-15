// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Authentication from './components/Authentication/Authentication';
import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoutes/ProtectedRoutes';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Authentication />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
