import { Navigate } from 'react-router-dom';
import { useAuth } from 'hooks';

export const PublicRoute = ({ children, redirectTo = '/' }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Navigate to={redirectTo} /> : children;
};
