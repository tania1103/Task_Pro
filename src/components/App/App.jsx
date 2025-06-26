import { Suspense, lazy, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from 'hooks';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { refreshUser } from '../../redux/auth/authOperations';
import { PrivateRoute } from '../../routes/PrivateRoute';
import { PublicRoute } from '../../routes/PublicRoute';
import SharedLayout from 'layouts/SharedLayout';
import Loader from 'components/Loader/Loader';
import { getTheme } from '../../redux/theme/themeOperation';

const WelcomePage = lazy(() => import('pages/WelcomePage'));
const AuthPage = lazy(() => import('pages/AuthPage'));
const HomePage = lazy(() => import('pages/HomePage'));
const ScreensPage = lazy(() => import('pages/ScreensPage'));
const NotFoundPage = lazy(() => import('pages/NotFoundPage'));
const StatsPage = lazy(() => import('pages/StatsPage'));
const SchedulePage = lazy(() => import('pages/SchedulePage'));

const App = () => {
  const dispatch = useDispatch();
  const { isRefreshing } = useAuth();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    // ✅ Apelăm refreshUser DOAR dacă avem ambele tokenuri
    if (accessToken && refreshToken) {
      dispatch(refreshUser()).then(() => {
        dispatch(getTheme());
      });
    } else {
      console.warn('🔁 Skip refreshUser: lipsesc tokenurile din localStorage');
    }
  }, [dispatch]);

  return isRefreshing ? (
    <Loader strokeColor="#fff" />
  ) : (
    <>
      <Toaster position="top-center" />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute component={<WelcomePage />} redirectTo="/home" />
            }
          />
          <Route
            path="/auth/:id"
            element={
              <PublicRoute component={<AuthPage />} redirectTo="/home" />
            }
          />
          <Route path="/home" element={<SharedLayout />}>
            <Route
              index
              element={
                <PrivateRoute
                  component={<HomePage />}
                  redirectTo="/auth/login"
                />
              }
            />
            <Route
              path="board/:boardId"
              element={
                <PrivateRoute
                  component={<ScreensPage />}
                  redirectTo="/auth/login"
                />
              }
            />
            <Route
              path="stats"
              element={
                <PrivateRoute
                  component={<StatsPage />}
                  redirectTo="/auth/login"
                />
              }
            />
            <Route
              path="schedule"
              element={
                <PrivateRoute
                  component={<SchedulePage />}
                  redirectTo="/auth/login"
                />
              }
            />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
