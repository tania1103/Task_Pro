import toast from 'react-hot-toast';
import { createAsyncThunk } from '@reduxjs/toolkit';
import ENDPOINTS from 'api/endpoints';
import axiosInstance from 'api/axiosInstance';
import { TOASTER_CONFIG } from 'constants';

const setAuthorizationHeader = token => {
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const unsetAuthorizationHeader = () => {
  axiosInstance.defaults.headers.common.Authorization = '';
};

// 🟢 REGISTER
export const register = createAsyncThunk(
  'auth/register',
  async (credentials, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(
        ENDPOINTS.auth.register,
        credentials
      );

      const { token, refreshToken, user } = data;

      setAuthorizationHeader(token);
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);

      return {
        ...user,
        tokenAccess: token,
        refreshToken,
      };
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Registration failed',
        TOASTER_CONFIG
      );
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 🟢 LOGIN
export const logIn = createAsyncThunk(
  'auth/logIn',
  async (credentials, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(
        ENDPOINTS.auth.login,
        credentials
      );

      const { token, refreshToken, user } = data;

      setAuthorizationHeader(token);
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);

      return {
        ...user,
        tokenAccess: token,
        refreshToken,
      };
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Login failed',
        TOASTER_CONFIG
      );
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 🔴 LOGOUT
export const logOut = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const refreshToken =
    state.auth.refreshToken || localStorage.getItem('refreshToken');

  if (!refreshToken) {
    return thunkAPI.rejectWithValue('No refresh token');
  }

  try {
    await axiosInstance.post(ENDPOINTS.auth.logout, {
      refreshToken,
    });

    localStorage.removeItem('refreshToken');
    unsetAuthorizationHeader();
  } catch (error) {
    toast.error(error.response.data.message, TOASTER_CONFIG);
    return thunkAPI.rejectWithValue(error.message);
  }
});

// 🔄 REFRESH USER
export const refreshUser = createAsyncThunk(
  'auth/profile',
  async (_, thunkAPI) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token available');

      const { data } = await axiosInstance.post(ENDPOINTS.auth.refreshToken, {
        refreshToken,
      });

      const { token, user } = data;
      if (!token) throw new Error('No token returned from refresh');

      setAuthorizationHeader(token);
      localStorage.setItem('accessToken', token);

      return {
        ...user,
        tokenAccess: token,
        refreshToken,
      };
    } catch (error) {
      console.error('Token refresh failed:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ✏️ EDIT USER
export const editUserAvatar = createAsyncThunk(
  'user/editUser',
  async (dataUser, thunkAPI) => {
    const formData = new FormData();
    const { profileImage } = dataUser;

    if (profileImage instanceof File) {
      formData.append('avatar', profileImage);
    }

    try {
      const { data } = await axiosInstance.patch(
        ENDPOINTS.users.avatar,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      return data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Update failed',
        TOASTER_CONFIG
      );
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const editUserInfo = createAsyncThunk(
  'user/editUserInfo',
  async ({ name, email }, thunkAPI) => {
    try {
      const { data } = await axiosInstance.put(
        ENDPOINTS.users.profile, // asigură-te că acesta e endpointul corect
        { name, email }
      );
      return data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Update failed',
        TOASTER_CONFIG
      );
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
