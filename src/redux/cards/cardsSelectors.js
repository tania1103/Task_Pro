import { createSelector } from '@reduxjs/toolkit';

// Selectori de bază
export const selectCardsState = state => state.cards || {};

export const selectAllCards = state => selectCardsState(state).items || [];
export const selectFilteredCards = state => selectCardsState(state).filteredCards || [];
export const selectCardsLoading = state => selectCardsState(state).isLoading;
export const selectCardsError = state => selectCardsState(state).error;

// Selectori derivați
export const selectCardsByColumnId = createSelector(
  [selectAllCards, (_, columnId) => columnId],
  (cards, columnId) => cards.filter(card => card.column === columnId)
);

export const selectCardById = createSelector(
  [selectAllCards, (_, cardId) => cardId],
  (cards, cardId) => cards.find(card => card._id === cardId)
);

export const selectCardsByPriority = createSelector(
  [selectAllCards, (_, priority) => priority],
  (cards, priority) => cards.filter(card => card.priority === priority)
);

// Export grupat pentru compatibilitate
export const cardsSelectors = {
  selectAllCards,
  selectFilteredCards,
  selectCardsLoading,
  selectCardsError,
  selectCardsByColumnId,
  selectCardById,
  selectCardsByPriority
};
