const ENDPOINTS = Object.freeze({
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refreshToken: '/api/auth/refresh',
    me: '/api/auth/me',
  },

  users: {
    theme: '/api/users/theme',
    avatar: '/api/users/avatar',
    profile: '/api/users/profile',
  },

  boards: {
    allBoards: '/api/boards', // GET/POST
    oneBoard: id => `/api/boards/${id}`, // GET/PUT/DELETE
    uploadBackground: id => `/api/boards/${id}/background`, // PATCH
    boardFilter: id => `/api/boards/${id}/filter`, // opțional
  },

  columns: {
    allColumns: '/api/columns', // GET/POST
    oneColumn: id => `/api/columns/${id}`, // GET/PUT/DELETE
  },

  cards: {
    allCards: '/api/cards', // GET/POST
    cardsStats: '/api/cards/stats', // GET
    oneCard: id => `/api/cards/${id}`, // GET/PUT/DELETE
    cardStatus: id => `/api/cards/${id}/status`, // PATCH
    cardOrder: id => `/api/cards/${id}/order`, // PATCH
  },

  email: {
    support: '/api/need-help', // POST
  },
});

export default ENDPOINTS;
