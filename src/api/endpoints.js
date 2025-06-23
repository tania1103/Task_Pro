const ENDPOINTS = Object.freeze({
  auth: {
    register: 'auth/register',
    login: 'auth/login',
    logout: 'auth/logout',
    refreshToken: 'auth/refresh',
  },
  users: {
    current: 'users/current',
    theme: 'users/current/theme',
  },
  backgrounds: 'api/backgrounds',

  email: {
    support: 'email/support',
  },
});

export default ENDPOINTS;
