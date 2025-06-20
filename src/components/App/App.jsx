/**
 * Main App component
 */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';

// Theme imports
import { lightTheme, darkTheme, violetTheme, THEMES, useThemeManager } from './theme';

// Layout components
import AppLayout from './components/common/AppLayout';
import AuthLayout from './components/auth/AuthLayout';

// Auth pages
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';

// App pages
import DashboardPage from './pages/Dashboard';
import BoardPage from './pages/Board';
import ProfilePage from './pages/Profile';
import HelpPage from './pages/Help';

// Routes and guards
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

// Redux actions
import { refreshToken } from './features/authSlice';
import { fetchBoards } from './features/boardsSlice';

// Get theme based on name
const getTheme = (themeName) => {
  switch (themeName) {
    case THEMES.LIGHT:
      return lightTheme;
    case THEMES.VIOLET:
      return violetTheme;
    case THEMES.DARK:
      return darkTheme;
    default:
      return lightTheme;
  }
};

const App = () => {
  const dispatch = useDispatch();
  const { currentTheme } = useThemeManager();
  const theme = getTheme(currentTheme);

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('taskpro_token');
    if (token) {
      dispatch(refreshToken(token))
        .unwrap()
        .then(() => {
          // Fetch boards after successful authentication
          dispatch(fetchBoards());
        })
        .catch(() => {
          // Token is invalid, do nothing
        });
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
            </Route>
          </Route>

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/boards/:boardId" element={<BoardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/help" element={<HelpPage />} />
            </Route>
          </Route>

          {/* Redirect to login for unknown routes */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
