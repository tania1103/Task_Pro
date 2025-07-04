import { createSlice } from '@reduxjs/toolkit';
import {
  addColumn,
  deleteColumn,
  editColumn,
  getColumnsByBoard,
  reorderColumns
} from './columnsOperations';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const columnsSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    setColumns: (state, action) => {
      state.items = action.payload;
    },
    clearColumns: (state) => {
      state.items = [];
    },
  },
  extraReducers: builder => {
    // Get columns by board
    builder
      .addCase(getColumnsByBoard.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getColumnsByBoard.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(getColumnsByBoard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

    // Add column
      .addCase(addColumn.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addColumn.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.isLoading = false;
      })
      .addCase(addColumn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

    // Edit column
      .addCase(editColumn.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editColumn.fulfilled, (state, action) => {
        const index = state.items.findIndex(column => column._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.isLoading = false;
      })
      .addCase(editColumn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

    // Delete column
      .addCase(deleteColumn.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteColumn.fulfilled, (state, action) => {
        state.items = state.items.filter(column => column._id !== action.payload._id);
        state.isLoading = false;
      })
      .addCase(deleteColumn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

    // Reorder columns
      .addCase(reorderColumns.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(reorderColumns.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(reorderColumns.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setColumns, clearColumns } = columnsSlice.actions;
export const columnsReducer = columnsSlice.reducer;
