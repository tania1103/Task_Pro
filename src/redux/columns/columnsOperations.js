import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'api/axiosInstance';
import ENDPOINTS from 'api/endpoints';

export const addColumn = createAsyncThunk(
  'columns/addColumn',
  async (newColumn, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        ENDPOINTS.columns.allColumns,
        newColumn
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteColumn = createAsyncThunk(
  'columns/deleteColumn',
  async (columnId, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(ENDPOINTS.columns.oneColumn(columnId));
      return { _id: columnId, ...response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const editColumn = createAsyncThunk(
  'columns/editColumn',
  async ({ editedColumn, id }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(
        ENDPOINTS.columns.oneColumn(id),
        editedColumn
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getColumnsByBoard = createAsyncThunk(
  'columns/getColumnsByBoard',
  async (boardId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.columns.columnsByBoard(boardId));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const reorderColumns = createAsyncThunk(
  'columns/reorderColumns',
  async ({ boardId, columns }, thunkAPI) => {
    try {
      // Map the columns to the expected format for the API
      const reorderData = columns.map((column, index) => ({
        _id: column._id,
        order: index
      }));

      const response = await axiosInstance.patch(
        ENDPOINTS.columns.reorderColumns(boardId),
        { columns: reorderData }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
