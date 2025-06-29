import { createSlice } from '@reduxjs/toolkit';
import {
  getAllBoards,
  createBoard,
  deleteBoard,
  getOneBoard,
  updateBoard,
} from './boardOperations';
import {
  addCard,
  editCard,
  deleteCard,
  filterCards,
  moveCard,
  getStatistics,
  getAllCards,
  changeCardOrder,
} from '../cards/cardsOperations';
import {
  addColumn,
  editColumn,
  deleteColumn,
} from '../columns/columnsOperations';
import { handlePending, handleRejected } from '../helpers';

const initialState = {
  boards: [],
  oneBoard: {},
  isLoading: false,
  error: null,
  stats: {},
  allCards: [],
};

const boardsSlice = createSlice({
  name: 'board',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(getAllBoards.fulfilled, (state, { payload }) => {
        state.boards = payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getOneBoard.fulfilled, (state, { payload }) => {
        state.oneBoard = {
          ...payload.data,
          columns: payload.data.columns || [],
        };
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createBoard.fulfilled, (state, { payload }) => {
        const board = payload.data || payload; // ← aici e cheia
        const newBoard = { ...board, columns: [] };
        if (!Array.isArray(state.boards)) state.boards = [];
        state.boards.push(newBoard);
        state.oneBoard = newBoard;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateBoard.fulfilled, (state, { payload }) => {
        const updated = payload.data;
        state.oneBoard = { ...state.oneBoard, ...updated };
        state.boards = state.boards.map(board =>
          board._id === updated._id ? { ...board, ...updated } : board
        );
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteBoard.fulfilled, state => {
        state.boards = state.boards.filter(
          board => board._id !== state.oneBoard._id
        );
        state.isLoading = false;
        state.error = null;
      })
      .addCase(filterCards.fulfilled, (state, { payload }) => {
        state.oneBoard = {
          ...payload,
          columns: payload.columns || [],
        };
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addColumn.fulfilled, (state, { payload }) => {
        if (!Array.isArray(state.oneBoard.columns)) {
          state.oneBoard.columns = [];
        }
        state.oneBoard.columns.push(payload.column);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editColumn.fulfilled, (state, { payload }) => {
        const index = state.oneBoard.columns.findIndex(
          col => col._id === payload.column._id
        );
        if (index !== -1) {
          state.oneBoard.columns[index].title = payload.column.title;
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteColumn.fulfilled, (state, { payload }) => {
        state.oneBoard.columns = state.oneBoard.columns.filter(
          col => col._id !== payload
        );
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addCard.fulfilled, (state, { payload }) => {
        const column = state.oneBoard.columns.find(
          col => col._id === payload.column
        );
        if (!column) return;
        if (!Array.isArray(column.cards)) column.cards = [];
        column.cards.push(payload);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteCard.fulfilled, (state, { payload }) => {
        const column = state.oneBoard.columns.find(
          col => col._id === payload.columnId
        );
        if (!column?.cards) return;
        column.cards = column.cards.filter(card => card._id !== payload.cardId);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editCard.fulfilled, (state, { payload }) => {
        const column = state.oneBoard.columns.find(
          col => col._id === payload.columnId
        );
        if (!column?.cards) return;
        column.cards = column.cards.map(card =>
          card._id === payload.card._id ? payload.card : card
        );
        state.isLoading = false;
        state.error = null;
      })
      .addCase(moveCard.fulfilled, (state, { payload }) => {
        const oldColumn = state.oneBoard.columns.find(
          col => col._id === payload.oldColumn
        );
        const newColumn = state.oneBoard.columns.find(
          col => col._id === payload.card.column
        );
        if (!oldColumn?.cards || !newColumn) return;
        oldColumn.cards = oldColumn.cards.filter(
          card => card._id !== payload.card._id
        );
        if (!Array.isArray(newColumn.cards)) newColumn.cards = [];
        newColumn.cards.push(payload.card);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getStatistics.fulfilled, (state, { payload }) => {
        state.stats = payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getAllCards.fulfilled, (state, { payload }) => {
        state.allCards = payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changeCardOrder.fulfilled, (state, { payload }) => {
        const column = state.oneBoard.columns.find(
          col => col._id === payload.column
        );
        if (!column?.cards) return;
        const fromIndex = column.cards.findIndex(
          card => card._id === payload._id
        );
        if (fromIndex === -1) return;
        const updated = [...column.cards];
        const [movedCard] = updated.splice(fromIndex, 1);
        updated.splice(payload.order, 0, movedCard);
        column.cards = updated;
        state.isLoading = false;
        state.error = null;
      })
      .addMatcher(action => action.type.endsWith('/pending'), handlePending)
      .addMatcher(action => action.type.endsWith('/rejected'), handleRejected);
  },
});

export const boardsReducer = boardsSlice.reducer;
