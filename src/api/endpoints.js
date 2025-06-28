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
    allBoards: '/api/boards',
    oneBoard: id => `/api/boards/${id}`,
    boardFilter: id => `/api/boards/${id}/filter`,
    backgrounds: '/api/boards/{id}/background',
  },
  columns: {
    allColumns: '/api/columns',
    oneColumn: id => `/api/columns/${id}`,
  },
  cards: {
    allCards: '/api/cards',
    cardsStats: '/api/cards/stats',
    oneCard: id => `/api/cards/${id}`,
    cardStatus: id => `/api/cards/${id}/status`,
    cardOrder: id => `/api/cards/${id}/order`,
  },
  email: {
    support: '/api/need-help',
  },
});

export default ENDPOINTS;
