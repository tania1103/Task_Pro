import { createSlice } from '@reduxjs/toolkit';
import {
  register,
  logIn,
  logOut,
  refreshUser,
  editUserAvatar,
} from './authOperations';
import { handlePending, handleRejected } from '../helpers';

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
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
      .addCase(editUserAvatar.pending, handlePending)
      .addCase(refreshUser.pending, state => {
        state.isLoading = true;
        state.isRefreshing = true;
      })

      // ✅ REGISTER
      .addCase(register.fulfilled, (state, { payload }) => {
        console.log('✅ REGISTER payload:', payload);

        if (payload?.tokenAccess) state.token = payload.tokenAccess;
        if (payload?.refreshToken) state.refreshToken = payload.refreshToken;

        state.user = payload;
        state.isLoggedIn = true;
        state.isLoading = false;
      })

      // ✅ LOGIN
      .addCase(logIn.fulfilled, (state, { payload }) => {
        console.log('✅ LOGIN payload:', payload);

        if (payload?.tokenAccess) state.token = payload.tokenAccess;
        if (payload?.refreshToken) state.refreshToken = payload.refreshToken;

        state.user = payload;
        state.isLoggedIn = true;
        state.isLoading = false;
      })

      // ✅ LOGOUT
      .addCase(logOut.fulfilled, state => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isLoggedIn = false;
        state.isLoading = false;
      })

      // ✅ REFRESH USER
      .addCase(refreshUser.fulfilled, (state, { payload }) => {
        console.log('✅ REFRESH payload:', payload);

        const tokenFromLocalStorage = localStorage.getItem('accessToken');
        if (!tokenFromLocalStorage) {
          console.warn(
            '⚠️ No valid token found in localStorage after refresh. Skipping state update.'
          );
          return;
        }

        state.user = payload; // ✅ extragem doar userul
        console.log('✅ REFRESH user:', state.user);
        state.token = tokenFromLocalStorage;
        state.refreshToken =
          payload.refreshToken || localStorage.getItem('refreshToken');
        state.isLoggedIn = true;
        state.isRefreshing = false;
        state.isLoading = false;
      })

      // ✅ EDIT USER
      .addCase(editUserAvatar.fulfilled, (state, { payload }) => {
        if (payload?.profileImage) {
          console.log('editUserAvatar.fulfilled', payload);
          state.user = {
            ...state.user,
            // ...payload.user,
            profileImage: payload.profileImage,
          };
        }
        state.isLoggedIn = true;
        state.isLoading = false;
      })

      // ❌ REJECTED
      .addCase(register.rejected, handleRejected)
      .addCase(logIn.rejected, handleRejected)
      .addCase(logOut.rejected, handleRejected)
      .addCase(editUserAvatar.rejected, handleRejected)
      .addCase(refreshUser.rejected, (state, { payload }) => {
        state.isRefreshing = false;
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export const authReducer = authSlice.reducer;
