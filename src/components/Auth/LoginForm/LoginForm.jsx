// Exemplu simplificat pentru LoginForm.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from 'redux/auth/authSlice';

const LoginForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={loading}>
        Login
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default LoginForm;
