export const selectAllCards = state => state.cards.items;

export const selectCardsByColumn = (state, columnId) =>
  state.cards.items.filter(card => card.columnId === columnId);

export const selectCardById = (state, cardId) =>
  state.cards.items.find(card => card.id === cardId);

export const selectCardsLoading = state => state.cards.loading;

export const selectCardsError = state => state.cards.error;
