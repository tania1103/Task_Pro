import { createSlice } from '@reduxjs/toolkit';
import {
  register,
  logIn,
  logOut,
  refreshUser,
  editUser,
} from './authOperations';
import { handlePending, handleRejected } from '../helpers';

const initialState = {
  user: null,
  token: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isLoggedIn: false,
  isLoading: false,
  isRefreshing: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: builder => {
    builder
      // 🔁 Pending
      .addCase(register.pending, handlePending)
      .addCase(logIn.pending, handlePending)
      .addCase(logOut.pending, handlePending)
      .addCase(editUser.pending, handlePending)
      .addCase(refreshUser.pending, state => {
        state.isLoading = true;
        state.isRefreshing = true;
      })

      // ✅ Register
      .addCase(register.fulfilled, (state, { payload }) => {
        console.log('✅ REGISTER payload:', payload);

        if (!payload?.tokenAccess) return;

        state.user = payload;
        state.token = payload.tokenAccess;
        state.refreshToken = payload.refreshToken || null;
        state.isLoggedIn = true;
        state.isLoading = false;
      })

      // ✅ Login
      .addCase(logIn.fulfilled, (state, { payload }) => {
        console.log('✅ LOGIN payload:', payload);

        if (!payload?.tokenAccess) return;

        state.user = payload;
        state.token = payload.tokenAccess;
        state.refreshToken = payload.refreshToken || null;
        state.isLoggedIn = true;
        state.isLoading = false;
      })

      // ✅ Logout
      .addCase(logOut.fulfilled, state => {
        state.user = { name: null, email: null };
        state.token = null;
        state.refreshToken = null;
        state.isLoggedIn = false;
        state.isLoading = false;
      })

      // ✅ Refresh
      .addCase(refreshUser.fulfilled, (state, { payload }) => {
        if (!payload?.tokenAccess) return;

        state.user = { ...payload };
        state.token = payload.tokenAccess;
        state.isLoggedIn = true;
        state.isRefreshing = false;
        state.isLoading = false;
      })

      // ✅ Edit user
      .addCase(editUser.fulfilled, (state, { payload }) => {
        state.user = { ...state.user, ...payload.user };
        state.user.avatar_url = payload.user.avatar_url;
        state.isLoggedIn = true;
        state.isLoading = false;
      })

      // ❌ Rejected
      .addCase(register.rejected, handleRejected)
      .addCase(logIn.rejected, handleRejected)
      .addCase(logOut.rejected, handleRejected)
      .addCase(editUser.rejected, handleRejected)
      .addCase(refreshUser.rejected, (state, { payload }) => {
        state.isRefreshing = false;
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export const authReducer = authSlice.reducer;
