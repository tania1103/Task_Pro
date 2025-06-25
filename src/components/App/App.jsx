import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from 'pages/AuthPage';

// TODO: înlocuiește cu componenta reală când o ai
const Dashboard = () => (
  <div style={{ padding: '2rem' }}>Dashboard Placeholder</div>
);

const App = () => {
  return (
    <Routes>
      {/* Ruta principală de autentificare */}
      <Route path="/auth/:id" element={<AuthPage />} />

      {/* ✅ Dashboard provizoriu */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Ruta default care redirecționează către login */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};

export default App;
