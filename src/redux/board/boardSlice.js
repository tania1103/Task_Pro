// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// // Mock data inițial
// const initialBoards = [
//   { id: '1', name: 'Personal', description: 'Personal tasks' },
//   { id: '2', name: 'Work', description: 'Work tasks' },
// ];

// // GET boards (mock)
// export const fetchBoards = createAsyncThunk('boards/fetchBoards', async () => {
//   return new Promise(resolve => {
//     setTimeout(() => resolve(initialBoards), 500);
//   });
// });

// // ADD board (mock)
// export const createBoard = createAsyncThunk(
//   'boards/createBoard',
//   async board => {
//     return new Promise(resolve => {
//       setTimeout(() => resolve({ ...board, id: Date.now().toString() }), 500);
//     });
//   }
// );

// // UPDATE board (mock)
// export const updateBoard = createAsyncThunk(
//   'boards/updateBoard',
//   async board => {
//     return new Promise(resolve => {
//       setTimeout(() => resolve(board), 500);
//     });
//   }
// );

// // DELETE board (mock)
// export const deleteBoard = createAsyncThunk('boards/deleteBoard', async id => {
//   return new Promise(resolve => {
//     setTimeout(() => resolve(id), 500);
//   });
// });

// const boardSlice = createSlice({
//   name: 'boards',
//   initialState: {
//     items: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: builder => {
//     builder
//       // fetchBoards
//       .addCase(fetchBoards.pending, state => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchBoards.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = action.payload;
//       })
//       .addCase(fetchBoards.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       })
//       // addBoard
//       .addCase(createBoard.fulfilled, (state, action) => {
//         state.items.push(action.payload);
//       })
//       // updateBoard
//       .addCase(updateBoard.fulfilled, (state, action) => {
//         const idx = state.items.findIndex(b => b.id === action.payload.id);
//         if (idx !== -1) state.items[idx] = action.payload;
//       })
//       // deleteBoard
//       .addCase(deleteBoard.fulfilled, (state, action) => {
//         state.items = state.items.filter(b => b.id !== action.payload);
//       });
//   },
// });

// export default boardSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import {
  getBackgroundIcons,
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
  background: [],
  isLoading: false,
  error: null,
  stats: {},
  allCards: [],
  activeBoardId: null,
};

const findColumn = (state, columnId) =>
  state.oneBoard.columns.find(col => col._id === columnId);

const boardsSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setActiveBoardId(state, action) {
      state.activeBoardId = action.payload;
    },
  },
  extraReducers: builder => {
    // ========== PENDING ==========
    builder
      .addMatcher(action => action.type.endsWith('/pending'), handlePending)
      .addMatcher(action => action.type.endsWith('/rejected'), handleRejected);

    // ========== BOARD ACTIONS ==========
    builder
      .addCase(getBackgroundIcons.fulfilled, (state, { payload }) => {
        state.background = payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getAllBoards.fulfilled, (state, { payload }) => {
        state.boards = payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getOneBoard.fulfilled, (state, { payload }) => {
        state.oneBoard = { ...payload };
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createBoard.fulfilled, (state, { payload }) => {
        state.boards.push(payload);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateBoard.fulfilled, (state, { payload }) => {
        state.oneBoard = { ...state.oneBoard, ...payload };
        state.boards = state.boards.map(board =>
          board._id === payload._id ? payload : board
        );
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteBoard.fulfilled, state => {
        state.boards = state.boards.filter(
          ({ _id }) => _id !== state.oneBoard._id
        );
        state.isLoading = false;
        state.error = null;
      });

    // ========== COLUMN ACTIONS ==========
    builder
      .addCase(addColumn.fulfilled, (state, { payload }) => {
        state.oneBoard.columns.push(payload.column);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editColumn.fulfilled, (state, { payload }) => {
        const column = findColumn(state, payload.column._id);
        if (column) column.title = payload.column.title;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteColumn.fulfilled, (state, { payload }) => {
        state.oneBoard.columns = state.oneBoard.columns.filter(
          ({ _id }) => _id !== payload
        );
        state.isLoading = false;
        state.error = null;
      });

    // ========== CARD ACTIONS ==========
    builder
      .addCase(filterCards.fulfilled, (state, { payload }) => {
        state.oneBoard = payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addCard.fulfilled, (state, { payload }) => {
        const column = findColumn(state, payload.column);
        if (column) {
          if (!column.cards) column.cards = [];
          column.cards.push(payload);
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteCard.fulfilled, (state, { payload }) => {
        const column = findColumn(state, payload.columnId);
        if (column) {
          column.cards = column.cards.filter(
            ({ _id }) => _id !== payload.cardId
          );
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editCard.fulfilled, (state, { payload }) => {
        const column = findColumn(state, payload.columnId);
        if (column) {
          column.cards = column.cards.map(card =>
            card._id === payload.card._id ? payload.card : card
          );
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(moveCard.fulfilled, (state, { payload }) => {
        const oldColumn = findColumn(state, payload.oldColumn);
        const newColumn = findColumn(state, payload.card.column);
        if (oldColumn && newColumn) {
          oldColumn.cards = oldColumn.cards.filter(
            ({ _id }) => _id !== payload.card._id
          );
          if (!newColumn.cards) newColumn.cards = [];
          newColumn.cards.push(payload.card);
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changeCardOrder.fulfilled, (state, { payload }) => {
        const column = findColumn(state, payload.column);
        if (column) {
          const oldIndex = column.cards.findIndex(
            ({ _id }) => _id === payload._id
          );
          const [movedCard] = column.cards.splice(oldIndex, 1);
          column.cards.splice(payload.order, 0, movedCard);
        }
        state.isLoading = false;
        state.error = null;
      });

    // ========== MISC ==========
    builder
      .addCase(getStatistics.fulfilled, (state, { payload }) => {
        state.stats = payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getAllCards.fulfilled, (state, { payload }) => {
        state.allCards = payload;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const boardsReducer = boardsSlice.reducer;
export const { setActiveBoardId } = boardsSlice.actions;
