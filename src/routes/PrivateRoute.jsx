import { Navigate } from 'react-router-dom';
import { useAuth } from 'hooks';
import Loader from 'components/Loader';

export const PrivateRoute = ({ children, redirectTo }) => {
  const { isLoggedIn, isRefreshing } = useAuth();

  if (isRefreshing) return <Loader />;
  return isLoggedIn ? children : <Navigate to={redirectTo} />;
};
