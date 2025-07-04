import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'api/axiosInstance';
import ENDPOINTS from 'api/endpoints';
import { mapPriorityToBackend } from 'helpers/cardHelpers';

export const addCard = createAsyncThunk(
  'cards/addCard',
  async (cardInfo, thunkAPI) => {
    try {
      // Validate required fields before sending to API
      if (!cardInfo.title || !cardInfo.description || !cardInfo.column) {
        throw new Error('Missing required card fields');
      }

      // Ensure data format is correct for backend expectations
      const cardData = {
        title: cardInfo.title,
        description: cardInfo.description,
        priority: mapPriorityToBackend(cardInfo.priority),
        // Format data pentru a fi compatibilă cu backend-ul (ISO string)
        dueDate: cardInfo.deadline instanceof Date
          ? cardInfo.deadline.toISOString()
          : cardInfo.deadline,
        column: cardInfo.column,
      };

      console.log('Sending card data to API:', cardData);

      const { data } = await axiosInstance.post(
        ENDPOINTS.cards.allCards,
        cardData
      );

      return data.data || data.card || data;
    } catch (error) {
      console.error('Add card error:', error);
      if (error.response && error.response.data) {
        console.error('Error response data:', error.response.data);
      }
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add card'
      );
    }
  }
);

export const deleteCard = createAsyncThunk(
  'cards/deleteCard',
  async ({ cardId, columnId }, thunkAPI) => {
    try {
      await axiosInstance.delete(ENDPOINTS.cards.oneCard(cardId));
      return { cardId, columnId };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const editCard = createAsyncThunk(
  'cards/editCard',
  async ({ cardId, editedCard }, thunkAPI) => {
    try {
      // Validate required fields
      if (!cardId || !editedCard.title || !editedCard.description || !editedCard.column) {
        throw new Error('Missing required card fields for editing');
      }

      // Ensure data format is correct for backend expectations
      const cardData = {
        title: editedCard.title,
        description: editedCard.description,
        priority: mapPriorityToBackend(editedCard.priority),
        dueDate: editedCard.deadline instanceof Date
          ? editedCard.deadline.toISOString()
          : editedCard.deadline,
        column: editedCard.column,
      };

      console.log('Sending edit card data:', cardData);

      const { data } = await axiosInstance.patch(
        ENDPOINTS.cards.oneCard(cardId),
        cardData
      );

      return { card: data.data || data.card || data, columnId: editedCard.column };
    } catch (error) {
      console.error('Edit card error:', error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to edit card'
      );
    }
  }
);

export const filterCards = createAsyncThunk(
  'boards/filterCards',
  async ({ boardId, priority }, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(
        ENDPOINTS.boards.boardFilter(boardId) + `?priority=${priority}`
      );

      return data.board[0];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const moveCard = createAsyncThunk(
  'cards/moveCard',
  async ({ cardId, newColumn, oldColumn }, thunkAPI) => {
    try {
      const { data } = await axiosInstance.patch(
        ENDPOINTS.cards.moveCard(cardId),
        { newColumnId: newColumn } // Backend expects newColumnId not columnId
      );

      return { card: data.data || data.card || data, oldColumn };
    } catch (error) {
      console.error('Move card error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const changeCardOrder = createAsyncThunk(
  'cards/changeCardOrder',
  async ({ cardId, columnId, order }, thunkAPI) => {
    try {
      const { data } = await axiosInstance.patch(
        ENDPOINTS.cards.reorderCards,
        { cardId, columnId, order }
      );

      return data.data || data.card || data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getAllCards = createAsyncThunk(
  'cards/getAllCards',
  async (_, thunkAPI) => {
    try {
      // Obținem board-ul activ din state
      const state = thunkAPI.getState();
      const activeBoard = state.board.oneBoard;

      if (!activeBoard || !activeBoard._id) {
        console.log('⚠️ Nu există board activ, returnez array gol de carduri');
        return [];
      }

      // Obținem toate coloanele pentru board-ul activ
      const columns = state.columns?.items || [];
      if (!columns.length) {
        console.log('⚠️ Board-ul nu are coloane, returnez array gol de carduri');
        return [];
      }

      // Colectăm cardurile din toate coloanele
      let allCards = [];

      // Pentru fiecare coloană, obținem cardurile sale
      for (const column of columns) {
        if (column && column._id) {
          try {
            console.log(`🔄 Obțin carduri pentru coloana: ${column.title} (${column._id})`);
            const { data } = await axiosInstance.get(
              ENDPOINTS.cards.allCardsByColumn(column._id)
            );
            const columnCards = data.cards || data.data || data || [];
            console.log(`✅ Am primit ${columnCards.length} carduri pentru coloana ${column.title}`);

            // Adăugăm ID-ul coloanei la fiecare card pentru referință
            const cardsWithColumnInfo = columnCards.map(card => ({
              ...card,
              columnId: column._id
            }));

            allCards = [...allCards, ...cardsWithColumnInfo];
          } catch (columnError) {
            console.warn(`⚠️ Eroare la obținerea cardurilor pentru coloana ${column._id}:`,
              columnError.message || columnError);
            // Continuăm cu următoarea coloană, nu întrerupem întregul proces
          }
        }
      }

      console.log(`📊 Total carduri obținute: ${allCards.length}`);
      return allCards;
    } catch (error) {
      console.error('❌ Eroare generală în getAllCards:', error.message || error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getCardsByColumn = createAsyncThunk(
  'cards/getCardsByColumn',
  async (columnId, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(
        ENDPOINTS.cards.allCardsByColumn(columnId)
      );
      return { cards: data.cards || data.data || data, columnId };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getStatistics = createAsyncThunk(
  'cards/getStatistics',
  async (_, thunkAPI) => {
    try {
      // Obținem cardurile actuale din stare
      const state = thunkAPI.getState();
      const cards = state.cards?.items || [];

      // Dacă nu avem carduri, returnăm statistici goale
      if (!cards.length) {
        console.log('⚠️ Nu există carduri pentru calculul statisticilor');
        return {
          all: getEmptyStatsObject()
        };
      }

      console.log(`📊 Calculez statistici pentru ${cards.length} carduri`);

      // Calculăm statisticile pe frontend
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekLater = new Date(today);
      weekLater.setDate(today.getDate() + 7);
      const monthLater = new Date(today);
      monthLater.setMonth(today.getMonth() + 1);

      // Statistici pentru toate cardurile
      const allStats = {
        number: cards.length,
        without: cards.filter(card => !card.priority || card.priority === 'without').length,
        low: cards.filter(card => card.priority === 'low').length,
        medium: cards.filter(card => card.priority === 'medium').length,
        high: cards.filter(card => card.priority === 'high').length,
        outdated: cards.filter(card => card.dueDate && new Date(card.dueDate) < today).length,
        today: cards.filter(card => {
          if (!card.dueDate) return false;
          const dueDate = new Date(card.dueDate);
          return dueDate >= today && dueDate < new Date(today.getTime() + 24*60*60*1000);
        }).length,
        week: cards.filter(card => {
          if (!card.dueDate) return false;
          const dueDate = new Date(card.dueDate);
          return dueDate >= today && dueDate <= weekLater &&
                 dueDate >= new Date(today.getTime() + 24*60*60*1000);
        }).length,
        month: cards.filter(card => {
          if (!card.dueDate) return false;
          const dueDate = new Date(card.dueDate);
          return dueDate > weekLater && dueDate <= monthLater;
        }).length,
        further: cards.filter(card => card.dueDate && new Date(card.dueDate) > monthLater).length
      };

      // Grupăm cardurile pe board-uri pentru statistici per board
      const cardsByBoard = {};
      const boardsMap = {};

      // Obținem board-urile și coloanele
      const boards = state.board?.boards || [];
      const columns = state.columns?.items || [];

      // Creăm un map pentru a găsi rapid board-ul unei coloane
      columns.forEach(column => {
        if (column.board) {
          const boardId = typeof column.board === 'object' ? column.board._id : column.board;
          if (boardId) {
            boardsMap[column._id] = boardId;
          }
        }
      });

      // Grupăm cardurile după board
      cards.forEach(card => {
        const columnId = card.column;
        const boardId = boardsMap[columnId];

        if (boardId) {
          if (!cardsByBoard[boardId]) {
            cardsByBoard[boardId] = [];

            // Găsim numele board-ului
            const board = boards.find(b => b._id === boardId);
            if (board) {
              cardsByBoard[boardId].title = board.title;
            }
          }
          cardsByBoard[boardId].push(card);
        }
      });

      // Calculăm statistici pentru fiecare board
      const result = { all: allStats };

      Object.entries(cardsByBoard).forEach(([boardId, boardCards]) => {
        const boardTitle = boardCards.title;
        const boardCardsList = boardCards.filter(item => typeof item !== 'string');

        result[boardId] = {
          title: boardTitle,
          number: boardCardsList.length,
          without: boardCardsList.filter(card => !card.priority || card.priority === 'without').length,
          low: boardCardsList.filter(card => card.priority === 'low').length,
          medium: boardCardsList.filter(card => card.priority === 'medium').length,
          high: boardCardsList.filter(card => card.priority === 'high').length,
          outdated: boardCardsList.filter(card => card.dueDate && new Date(card.dueDate) < today).length,
          today: boardCardsList.filter(card => {
            if (!card.dueDate) return false;
            const dueDate = new Date(card.dueDate);
            return dueDate >= today && dueDate < new Date(today.getTime() + 24*60*60*1000);
          }).length,
          week: boardCardsList.filter(card => {
            if (!card.dueDate) return false;
            const dueDate = new Date(card.dueDate);
            return dueDate >= today && dueDate <= weekLater &&
                  dueDate >= new Date(today.getTime() + 24*60*60*1000);
          }).length,
          month: boardCardsList.filter(card => {
            if (!card.dueDate) return false;
            const dueDate = new Date(card.dueDate);
            return dueDate > weekLater && dueDate <= monthLater;
          }).length,
          further: boardCardsList.filter(card => card.dueDate && new Date(card.dueDate) > monthLater).length
        };
      });

      console.log('✅ Statistici calculate:', result);
      return result;
    } catch (error) {
      console.error('❌ Eroare la calculul statisticilor:', error.message || error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Helper pentru obiecte de statistici goale
function getEmptyStatsObject() {
  return {
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
  };
}
