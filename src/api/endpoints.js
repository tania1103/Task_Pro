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
  boards: {
    allBoards: 'api/boards',
    oneBoard: boardId => `api/boards/${boardId}`,
    boardFilter: boardId => `api/boards/${boardId}/filter`,
  },
  columns: {
    allColumns: 'api/columns',
    oneColumn: columnId => `api/columns/${columnId}`,
  },
  cards: {
    allCards: 'api/cards',
    cardsStats: 'api/cards/stats',
    oneCard: cardId => `api/cards/${cardId}`,
    cardStatus: cardId => `api/cards/${cardId}/status`,
    cardOrder: cardId => `api/cards/${cardId}/order`,
  },
  email: {
    support: 'email/support',
  },
});

export default ENDPOINTS;