import ENDPOINTS from 'api/endpoints';
import axiosInstance from 'api/axiosInstance';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getTheme = createAsyncThunk(
  'theme/getTheme',
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(ENDPOINTS.users.theme); // GET /api/users/theme
      return data.theme; // ex: 'dark'
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
// redux/theme/themeOperation.js

export const updateTheme = createAsyncThunk(
  'theme/updateTheme',
  async (theme, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(ENDPOINTS.users.theme, {
        theme,
      });

      return response.data.data.theme;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
