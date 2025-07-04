import { createSlice } from '@reduxjs/toolkit';
import {
  addCard,
  deleteCard,
  editCard,
  moveCard,
  changeCardOrder,
  getAllCards,
  getCardsByColumn,
  filterCards,
  getStatistics
} from './cardsOperations';

const initialState = {
  items: [],
  filteredCards: [],
  stats: {
    all: {
      number: 0,
      without: 0,
      low: 0,
      medium: 0,
      high: 0,
      outdated: 0,
      today: 0,
      week: 0,
      month: 0,
      further: 0
    }
  },
  isLoading: false,
  error: null
};

// Funcții helper pentru reducer
const handlePending = (state) => {
  state.isLoading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    clearCards: (state) => {
      state.items = [];
      state.filteredCards = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Add Card
      .addCase(addCard.pending, handlePending)
      .addCase(addCard.fulfilled, (state, { payload }) => {
        state.items.push(payload);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addCard.rejected, handleRejected)

      // Delete Card
      .addCase(deleteCard.pending, handlePending)
      .addCase(deleteCard.fulfilled, (state, { payload }) => {
        state.items = state.items.filter(card => card._id !== payload.cardId);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteCard.rejected, handleRejected)

      // Edit Card
      .addCase(editCard.pending, handlePending)
      .addCase(editCard.fulfilled, (state, { payload }) => {
        const index = state.items.findIndex(card => card._id === payload.card._id);
        if (index !== -1) {
          state.items[index] = payload.card;
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(editCard.rejected, handleRejected)

      // Move Card
      .addCase(moveCard.pending, handlePending)
      .addCase(moveCard.fulfilled, (state, { payload }) => {
        const index = state.items.findIndex(card => card._id === payload.card._id);
        if (index !== -1) {
          state.items[index] = payload.card;
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(moveCard.rejected, handleRejected)

      // Change Card Order
      .addCase(changeCardOrder.pending, handlePending)
      .addCase(changeCardOrder.fulfilled, (state, { payload }) => {
        const index = state.items.findIndex(card => card._id === payload._id);
        if (index !== -1) {
          state.items[index] = payload;
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changeCardOrder.rejected, handleRejected)

      // Get All Cards
      .addCase(getAllCards.pending, handlePending)
      .addCase(getAllCards.fulfilled, (state, { payload }) => {
        // Dacă se primește un array gol sau payload invalid, tratăm special
        if (!payload || (Array.isArray(payload) && payload.length === 0)) {
          state.items = [];
          state.isLoading = false;
          state.error = null;
          return;
        }

        // Dacă avem date valide, le procesăm
        state.items = payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getAllCards.rejected, (state, action) => {
        // Tratăm special erorile 404 pentru endpoint-ul getAllCards
        if (action.error && action.error.message && action.error.message.includes('404')) {
          console.log('⚠️ getAllCards: 404 Not Found - tratăm ca array gol');
          state.items = [];
          state.isLoading = false;
          state.error = null;
        } else {
          // Tratăm alte erori normal
          handleRejected(state, action);
        }
      })

      // Get Cards By Column
      .addCase(getCardsByColumn.pending, handlePending)
      .addCase(getCardsByColumn.fulfilled, (state, { payload }) => {
        // Adăugăm cardurile noi, înlocuind pe cele existente din aceeași coloană
        const existingCards = state.items.filter(card => card.column !== payload.columnId);
        state.items = [...existingCards, ...payload.cards];
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getCardsByColumn.rejected, handleRejected)

      // Filter Cards
      .addCase(filterCards.pending, handlePending)
      .addCase(filterCards.fulfilled, (state, { payload }) => {
        state.filteredCards = payload.cards || [];
        state.isLoading = false;
        state.error = null;
      })
      .addCase(filterCards.rejected, handleRejected)

      // Get Statistics
      .addCase(getStatistics.pending, handlePending)
      .addCase(getStatistics.fulfilled, (state, { payload }) => {
        state.stats = payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getStatistics.rejected, (state, action) => {
        // Tratăm eroarea, dar păstrăm statisticile goale ca fallback
        state.isLoading = false;
        state.error = action.payload;
        console.error('❌ Eroare la încărcarea statisticilor:', action.payload);
      });
  }
});

export const { clearCards } = cardsSlice.actions;
export const cardsReducer = cardsSlice.reducer;
