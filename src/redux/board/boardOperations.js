import { createAsyncThunk } from '@reduxjs/toolkit';
import  axiosInstance  from 'api/axiosInstance';
import ENDPOINTS  from 'api/endpoints';


export const getBackgroundIcons = createAsyncThunk(
  'boards/getBackgroundIcons',
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(ENDPOINTS.backgrounds);
      return data.backgrounds;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getAllBoards = createAsyncThunk(
  'boards/getAllBoards',
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(ENDPOINTS.boards.allBoards);
      return data.boards;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createBoard = createAsyncThunk(
  'boards/createBoard',
  async (newBoard, thunkAPI) => {
    try {
      const formData = new FormData();
      const { title, iconId, background } = newBoard;
      formData.append('title', title);
      formData.append('iconId', iconId);

      !background.type?.startsWith('image')
        ? formData.append('backgroundId', background)
        : formData.append('background', background);

      const { data } = await axiosInstance.post(
        ENDPOINTS.boards.allBoards,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      return data.board;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateBoard = createAsyncThunk(
  'boards/updateBoard',
  async ({ boardId, dataUpdate }, thunkAPI) => {
    try {
      const formData = new FormData();
      const { title, iconId, background } = dataUpdate;
      formData.append('title', title);
      formData.append('iconId', iconId);

      if (background !== 'on') {
        !background.type?.startsWith('image')
          ? formData.append('backgroundId', background)
          : formData.append('background', background);
      }

      const { data } = await axiosInstance.patch(
        ENDPOINTS.boards.oneBoard(boardId),
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      return data.board;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteBoard = createAsyncThunk(
  'boards/deleteBoard',
  async (boardId, thunkAPI) => {
    try {
      const { data } = await axiosInstance.delete(
        ENDPOINTS.boards.oneBoard(boardId)
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getOneBoard = createAsyncThunk(
  'boards/getOneBoard',
  async (boardId, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(
        ENDPOINTS.boards.oneBoard(boardId)
      );

      return data.board[0];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
