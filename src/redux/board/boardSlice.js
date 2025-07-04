import { createSlice } from '@reduxjs/toolkit';
import {
  getAllBoards,
  createBoard,
  deleteBoard,
  getOneBoard,
  updateBoard,
} from './boardOperations';
import { filterCards } from '../cards/cardsOperations';
import { handlePending, handleRejected } from '../helpers';

const initialState = {
  boards: [],
  oneBoard: {},
  isLoading: false,
  error: null,
  stats: {},
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
        // Filter out any null/undefined columns or columns without _id
        const validColumns = (payload.data.columns || []).filter(col => col && col._id);

        state.oneBoard = {
          ...payload.data,
          columns: validColumns,
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
      .addMatcher(action => action.type.endsWith('/pending'), handlePending)
      .addMatcher(action => action.type.endsWith('/rejected'), handleRejected);
  },
});

export const boardsReducer = boardsSlice.reducer;
