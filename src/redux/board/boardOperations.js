import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'api/axiosInstance';
import ENDPOINTS from 'api/endpoints';

// ✅ GET: Toate boardurile
export const getAllBoards = createAsyncThunk(
  'boards/getAllBoards',
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(ENDPOINTS.boards.allBoards);
      console.log('✅ Răspuns getAllBoards:', data);

      return Array.isArray(data.boards) ? data.boards : data.data || data || [];
    } catch (error) {
      console.error('❌ getAllBoards error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ✅ POST: Creează board (JSON simplu)
export const createBoard = createAsyncThunk(
  'boards/createBoard',
  async ({ title, icon, background }, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(ENDPOINTS.boards.allBoards, {
        title,
        icon,
        background,
      });

      const board = data?.data || data;

      if (!board || !board._id) {
        throw new Error('Board creation succeeded but missing _id');
      }

      return { data: board };
    } catch (error) {
      console.error('❌ createBoard error:', error);

      if (error.response?.data) {
        console.warn('⚠️ Backend response:', error.response.data);
      }

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ✅ PATCH: Upload imagine fundal custom (FormData)
export const uploadCustomBackground = createAsyncThunk(
  'boards/uploadCustomBackground',
  async ({ boardId, imageFile }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const { data } = await axiosInstance.patch(
        `/api/boards/${boardId}/background`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return { data: data.data }; // standardizează
    } catch (error) {
      console.error('❌ uploadCustomBackground error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ✅ PUT: Actualizare board (titlu, icon, bg presetat)
export const updateBoard = createAsyncThunk(
  'boards/updateBoard',
  async ({ boardId, dataUpdate }, thunkAPI) => {
    try {
      const payload =
        dataUpdate instanceof FormData ? dataUpdate : { ...dataUpdate };

      const { data } = await axiosInstance.put(
        ENDPOINTS.boards.oneBoard(boardId),
        payload,
        {
          headers:
            dataUpdate instanceof FormData
              ? { 'Content-Type': 'multipart/form-data' }
              : {},
        }
      );

      const board = data?.data || data;

      return { data: board };
    } catch (error) {
      console.error('❌ updateBoard error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ✅ DELETE: Șterge board
export const deleteBoard = createAsyncThunk(
  'boards/deleteBoard',
  async (boardId, thunkAPI) => {
    try {
      await axiosInstance.delete(ENDPOINTS.boards.oneBoard(boardId));
      return boardId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ✅ GET: Un singur board complet
export const getOneBoard = createAsyncThunk(
  'boards/getOneBoard',
  async (boardId, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(
        ENDPOINTS.boards.oneBoard(boardId)
      );

      const board = data?.data || data;

      if (!board || !board._id) {
        return thunkAPI.rejectWithValue('Board not found');
      }

      return { data: board };
    } catch (error) {
      console.error('❌ getOneBoard error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
