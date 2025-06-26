import { createSlice } from '@reduxjs/toolkit';
import { handlePending, handleRejected } from '../helpers';
import { getTheme, updateTheme } from './themeOperation';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    theme: 'light',
    isLoading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(getTheme.pending, handlePending)
      .addCase(updateTheme.pending, handlePending)

      // payload este stringul cu tema
      .addCase(getTheme.fulfilled, (state, { payload }) => {
        state.theme = payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateTheme.fulfilled, (state, { payload }) => {
        state.theme = payload;
        state.isLoading = false;
        state.error = null;
      })

      .addCase(getTheme.rejected, handleRejected)
      .addCase(updateTheme.rejected, handleRejected);
  },
});

export const themeReducer = themeSlice.reducer;
