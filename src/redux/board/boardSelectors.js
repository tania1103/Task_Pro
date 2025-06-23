export const selectAllBoards = state => state.board.boards;

export const selectBoardById = (state, boardId) =>
  state.board.boards.find(board => board._id === boardId);

export const selectOneBoard = state => state.board.oneBoard;

export const selectBoardColumns = state => state.board.oneBoard?.columns || [];

export const selectBoardStats = state => state.board.stats;

export const selectBackgroundIcons = state => state.board.background;

export const selectBoardLoading = state => state.board.isLoading;

export const selectBoardError = state => state.board.error;
