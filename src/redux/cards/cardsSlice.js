// src/redux/cards/cardsSlice.js
import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';

// Simulăm o bază de date
const initialCards = [
  { id: '1', columnId: 'todo', title: 'First card', description: '' },
];

// ADD card
export const addCard = createAsyncThunk(
  'cards/addCard',
  async ({ columnId, title, description }) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: nanoid(),
          columnId,
          title,
          description: description || '',
        });
      }, 300);
    });
  }
);

// UPDATE card
export const updateCard = createAsyncThunk(
  'cards/updateCard',
  async ({ id, title, description }) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ id, title, description });
      }, 300);
    });
  }
);

// DELETE card
export const deleteCard = createAsyncThunk('cards/deleteCard', async id => {
  return new Promise(resolve => {
    setTimeout(() => resolve(id), 300);
  });
});

const cardsSlice = createSlice({
  name: 'cards',
  initialState: {
    items: initialCards,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addCard.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCard.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...action.payload,
          };
        }
      })
      .addCase(deleteCard.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c.id !== action.payload);
      });
  },
});

export default cardsSlice.reducer;
