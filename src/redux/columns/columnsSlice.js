// // src/redux/columns/columnsSlice.js
// import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';

// // Exemplu de date inițiale
// const initialColumns = [
//   { id: 'todo', boardId: '1', title: 'To Do' },
//   { id: 'inprogress', boardId: '1', title: 'In Progress' },
// ];

// // ADD column
// export const addColumn = createAsyncThunk(
//   'columns/addColumn',
//   async ({ boardId, title }) => {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve({
//           id: nanoid(),
//           boardId,
//           title,
//         });
//       }, 300);
//     });
//   }
// );

// // UPDATE column
// export const updateColumn = createAsyncThunk(
//   'columns/updateColumn',
//   async ({ id, title }) => {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve({ id, title });
//       }, 300);
//     });
//   }
// );

// // DELETE column
// export const deleteColumn = createAsyncThunk(
//   'columns/deleteColumn',
//   async id => {
//     return new Promise(resolve => {
//       setTimeout(() => resolve(id), 300);
//     });
//   }
// );

// const columnsSlice = createSlice({
//   name: 'columns',
//   initialState: {
//     items: initialColumns,
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: builder => {
//     builder
//       .addCase(addColumn.fulfilled, (state, action) => {
//         state.items.push(action.payload);
//       })
//       .addCase(updateColumn.fulfilled, (state, action) => {
//         const index = state.items.findIndex(c => c.id === action.payload.id);
//         if (index !== -1) {
//           state.items[index].title = action.payload.title;
//         }
//       })
//       .addCase(deleteColumn.fulfilled, (state, action) => {
//         state.items = state.items.filter(c => c.id !== action.payload);
//       });
//   },
// });

// export default columnsSlice.reducer;

import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';

// ========== THUNKS ==========

export const addColumn = createAsyncThunk(
  'columns/addColumn',
  async ({ boardId, title }) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ id: nanoid(), boardId, title });
      }, 300);
    });
  }
);

export const updateColumn = createAsyncThunk(
  'columns/updateColumn',
  async ({ id, title }) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ id, title });
      }, 300);
    });
  }
);

export const deleteColumn = createAsyncThunk(
  'columns/deleteColumn',
  async id => {
    return new Promise(resolve => {
      setTimeout(() => resolve(id), 300);
    });
  }
);

// ========== INITIAL STATE ==========

const initialState = {
  items: [
    { id: 'todo', boardId: '1', title: 'To Do' },
    { id: 'inprogress', boardId: '1', title: 'In Progress' },
  ],
  loading: false,
  error: null,
};

// ========== SLICE ==========

const columnsSlice = createSlice({
  name: 'columns',
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

      // ADD COLUMN
      .addCase(addColumn.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
        state.error = null;
      })

      // UPDATE COLUMN
      .addCase(updateColumn.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index].title = action.payload.title;
        }
        state.loading = false;
        state.error = null;
      })

      // DELETE COLUMN
      .addCase(deleteColumn.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c.id !== action.payload);
        state.loading = false;
        state.error = null;
      });
  },
});

export default columnsSlice.reducer;
