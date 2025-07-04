const ENDPOINTS = Object.freeze({
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout', //

    refreshToken: '/api/auth/refresh', // POST
    me: '/api/auth/me', // GET
    google: '/api/auth/google', //get
    callback: '/api/auth/google/callback' // GET
  },

  users: {
    theme: '/api/users/theme', //get/patch
    avatar: '/api/users/avatar', //patch
    profile: '/api/users/profile', //put
    account: '/api/users/account', //delete
  },

  boards: {
    allBoards: '/api/boards', // GET/POST
    oneBoard: id => `/api/boards/${id}`, // GET/PUT/DELETE
    uploadBackground: id => `/api/boards/${id}/background`, // PATCH
    boardFilter: id => `/api/boards/${id}/filter`, // opțional
  },

  columns: {
    allColumns: '/api/columns', //POST
    allColumnsByBoard: boardId => `/api/columns/board/${boardId}`, //GET
    oneColumn: id => `/api/columns/${id}`, // GET/PUT/DELETE
    reorderColumns: '/api/columns/reorder', // PATCH
  },

  cards: {
    allCards: '/api/cards', // POST (doar pentru crearea cardurilor)
    allCardsByColumn: columnId => `/api/cards/column/${columnId}`, // GET
    oneCard: id => `/api/cards/${id}`, // GET/PATCH/DELETE
    reorderCards: '/api/cards/reorder', // PATCH
    moveCard: id => `/api/cards/${id}/move`, // PATCH
  },

  email: {
    support: '/api/need-help', // POST
  },
});

export default ENDPOINTS;
