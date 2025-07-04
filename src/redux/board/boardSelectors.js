export const selectBoardsState = state => state.board || {};

export const selectBoards = state => selectBoardsState(state).boards || [];

export const selectBoardsIsLoading = state =>
  selectBoardsState(state).isLoading ?? false;

export const selectOneBoard = state => selectBoardsState(state).oneBoard || {};

export const selectStats = state => state.cards?.stats || {};

export const selectAllCards = state => selectBoardsState(state).allCards || [];

export const selectIsLoading = state =>
  selectBoardsState(state).isLoading ?? false;
