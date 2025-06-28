import axiosInstance from 'api/axiosInstance';
import ENDPOINTS from 'api/endpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const support = createAsyncThunk(
  'email/support',
  async ({ email, text }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.email.support, {
        email,
        comment: text,
      });
      return response.data;
    } catch ({ message }) {
      return thunkAPI.rejectWithValue(message);
    }
  }
);

