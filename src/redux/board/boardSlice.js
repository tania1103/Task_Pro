import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock data inițial
const initialBoards = [
  { id: '1', name: 'Personal', description: 'Personal tasks' },
  { id: '2', name: 'Work', description: 'Work tasks' },
];

// GET boards (mock)
export const fetchBoards = createAsyncThunk('boards/fetchBoards', async () => {
  return new Promise(resolve => {
    setTimeout(() => resolve(initialBoards), 500);
  });
});

// ADD board (mock)
export const createBoard = createAsyncThunk(
  'boards/createBoard',
  async board => {
    return new Promise(resolve => {
      setTimeout(() => resolve({ ...board, id: Date.now().toString() }), 500);
    });
  }
);

// UPDATE board (mock)
export const updateBoard = createAsyncThunk(
  'boards/updateBoard',
  async board => {
    return new Promise(resolve => {
      setTimeout(() => resolve(board), 500);
    });
  }
);

// DELETE board (mock)
export const deleteBoard = createAsyncThunk('boards/deleteBoard', async id => {
  return new Promise(resolve => {
    setTimeout(() => resolve(id), 500);
  });
});

const boardSlice = createSlice({
  name: 'boards',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // fetchBoards
      .addCase(fetchBoards.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // addBoard
      .addCase(createBoard.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // updateBoard
      .addCase(updateBoard.fulfilled, (state, action) => {
        const idx = state.items.findIndex(b => b.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // deleteBoard
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.items = state.items.filter(b => b.id !== action.payload);
      });
  },
});

export default boardSlice.reducer;
