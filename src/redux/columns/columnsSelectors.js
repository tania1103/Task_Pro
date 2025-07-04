import { createSelector } from '@reduxjs/toolkit';

// Base selectors
const selectColumns = state => state.columns.items;
const selectColumnsLoading = state => state.columns.isLoading;
const selectColumnsError = state => state.columns.error;

// Memoized selectors
const selectColumnById = createSelector(
  [selectColumns, (_, columnId) => columnId],
  (columns, columnId) => columns.find(column => column._id === columnId) || null
);

const selectSortedColumns = createSelector(
  [selectColumns],
  (columns) => [...columns].sort((a, b) => a.order - b.order)
);

export const columnsSelectors = {
  selectColumns,
  selectColumnsLoading,
  selectColumnsError,
  selectColumnById,
  selectSortedColumns,
};
