import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from 'pages/AuthPage';
// import alte pagini când apar, ex: HomePage, Dashboard etc.

const App = () => {
  return (
    <Routes>
      {/* Rută specială pentru testarea locală a paginii Auth */}
      <Route path="/test-auth" element={<AuthPage />} />

      {/* Ruta principală de autentificare */}
      <Route path="/auth/:id" element={<AuthPage />} />

      {/* Dacă vrei, poți adăuga o rută default care redirecționează către login */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

    </Routes>
  );
};

export default App;
