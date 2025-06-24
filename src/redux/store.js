import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import boardReducer from './board/boardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    boards: boardReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // De obicei necesar pentru persistenta
    }),
});

export const persistor = store; // Dacă folosești redux-persist, configurează-l aici
// Dacă nu folosești redux-persist, poți elimina această linie
