import LoginForm from 'components/Auth/LoginForm/LoginForm';
import RegisterForm from 'components/Auth/RegisterForm/RegisterForm';

import { useParams } from 'react-router-dom';

const AuthPage = () => {
  const { id } = useParams();

  return (
    <>
      {id === 'register' && <RegisterForm />}
      {id === 'login' && <LoginForm />}
    </>
  );
};

export default AuthPage;
