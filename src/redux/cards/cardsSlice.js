// // src/redux/cards/cardsSlice.js
// import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';

// // Simulăm o bază de date
// const initialCards = [
//   { id: '1', columnId: 'todo', title: 'First card', description: '' },
// ];

// // ADD card
// export const addCard = createAsyncThunk(
//   'cards/addCard',
//   async ({ columnId, title, description }) => {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve({
//           id: nanoid(),
//           columnId,
//           title,
//           description: description || '',
//         });
//       }, 300);
//     });
//   }
// );

// // UPDATE card
// export const updateCard = createAsyncThunk(
//   'cards/updateCard',
//   async ({ id, title, description }) => {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve({ id, title, description });
//       }, 300);
//     });
//   }
// );

// // DELETE card
// export const deleteCard = createAsyncThunk('cards/deleteCard', async id => {
//   return new Promise(resolve => {
//     setTimeout(() => resolve(id), 300);
//   });
// });

// const cardsSlice = createSlice({
//   name: 'cards',
//   initialState: {
//     items: initialCards,
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: builder => {
//     builder
//       .addCase(addCard.fulfilled, (state, action) => {
//         state.items.push(action.payload);
//       })
//       .addCase(updateCard.fulfilled, (state, action) => {
//         const index = state.items.findIndex(c => c.id === action.payload.id);
//         if (index !== -1) {
//           state.items[index] = {
//             ...state.items[index],
//             ...action.payload,
//           };
//         }
//       })
//       .addCase(deleteCard.fulfilled, (state, action) => {
//         state.items = state.items.filter(c => c.id !== action.payload);
//       });
//   },
// });

// export default cardsSlice.reducer;

import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';

// ========== THUNKS ==========

export const addCard = createAsyncThunk(
  'cards/addCard',
  async ({ columnId, title, description = '' }) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ id: nanoid(), columnId, title, description });
      }, 300);
    });
  }
);

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

export const deleteCard = createAsyncThunk('cards/deleteCard', async id => {
  return new Promise(resolve => {
    setTimeout(() => resolve(id), 300);
  });
});

// ========== INITIAL STATE ==========

const initialState = {
  items: [{ id: '1', columnId: 'todo', title: 'First card', description: '' }],
  loading: false,
  error: null,
};

// ========== SLICE ==========

const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // PENDING / REJECTED
      .addMatcher(
        action => action.type.endsWith('/pending'),
        state => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        action => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      )

      // ADD CARD
      .addCase(addCard.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
        state.error = null;
      })

      // UPDATE CARD
      .addCase(updateCard.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...action.payload,
          };
        }
        state.loading = false;
        state.error = null;
      })

      // DELETE CARD
      .addCase(deleteCard.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c.id !== action.payload);
        state.loading = false;
        state.error = null;
      });
  },
});

export default cardsSlice.reducer;
