import { ENDPOINTS, axiosInstance } from 'api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const support = createAsyncThunk(
  'email/support',
  async ({ email, text }, thunkAPI) => {
    try {
      const data = await axiosInstance.post(ENDPOINTS.email.support, {
        email,
        comment: text,
      });

      return data;
    } catch ({ message }) {
      thunkAPI.rejectWithValue(message);
    }
  }
);
