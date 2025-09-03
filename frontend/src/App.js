import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.svg';
import './App.css';
import Login from './pages/Login';

function Dashboard() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Dashboard Ingevec</h1>
      <p>Bienvenido al sistema. Aquí irá el panel principal.</p>
    </div>
  );
}

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

export const adminCredentials = {
  email: process.env.REACT_APP_ADMIN_EMAIL,
  password: process.env.REACT_APP_ADMIN_PASSWORD,
};