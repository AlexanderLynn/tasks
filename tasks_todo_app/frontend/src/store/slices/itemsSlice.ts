import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Item } from '../../services/itemsApi';

interface ItemsState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

const initialState: ItemsState = {
  items: [],
  loading: false,
  error: null,
};

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
    },
    mergeItems: (state, action: PayloadAction<Item[]>) => {
      const byId = new Map(state.items.map((item) => [item.id, item]));
      action.payload.forEach((item) => byId.set(item.id, item));
      state.items = Array.from(byId.values());
    },
    addItem: (state, action: PayloadAction<Item>) => {
      state.items.push(action.payload);
    },
    updateItem: (state, action: PayloadAction<Item>) => {
      const index = state.items.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    },
    updateItemNextDue: (state, action: PayloadAction<{ id: string; nextDueAt: string }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.nextDueAt = action.payload.nextDueAt;
      }
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setItems,
  mergeItems,
  addItem,
  updateItem,
  updateItemNextDue,
  deleteItem,
  setLoading,
  setError,
} = itemsSlice.actions;
export default itemsSlice.reducer;
