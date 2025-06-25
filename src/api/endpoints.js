const ENDPOINTS = Object.freeze({
  auth: {
    register: 'api/auth/register',
    login: 'api/auth/login',
    logout: 'api/auth/logout',
    refreshToken: 'api/auth/refresh',
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
