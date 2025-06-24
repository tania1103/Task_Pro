import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk pentru login (mock)
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, thunkAPI) => {
    // simulare request API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'test@test.com' && password === 'password') {
          resolve({ token: 'mock_token', user: { email } });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }
);

// Thunk pentru register (mock)
export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password }, thunkAPI) => {
    // simulare request API
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ token: 'mock_token', user: { email } });
      }, 1000);
    });
  }
);

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // login
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // register
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
