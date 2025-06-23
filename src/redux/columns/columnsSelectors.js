export const selectAllColumns = state => state.columns.items;

export const selectColumnsByBoard = (state, boardId) =>
  state.columns.items.filter(col => col.boardId === boardId);

export const selectColumnById = (state, columnId) =>
  state.columns.items.find(col => col.id === columnId);

export const selectColumnsLoading = state => state.columns.loading;

export const selectColumnsError = state => state.columns.error;
