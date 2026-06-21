import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface List {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface ListsState {
  lists: List[];
  currentList: List | null;
  loading: boolean;
  error: string | null;
}

const initialState: ListsState = {
  lists: [],
  currentList: null,
  loading: false,
  error: null,
};

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    setLists: (state, action: PayloadAction<List[]>) => {
      state.lists = action.payload;
    },
    setCurrentList: (state, action: PayloadAction<List | null>) => {
      state.currentList = action.payload;
    },
    addList: (state, action: PayloadAction<List>) => {
      state.lists.push(action.payload);
    },
    updateList: (state, action: PayloadAction<List>) => {
      const index = state.lists.findIndex(l => l.id === action.payload.id);
      if (index !== -1) {
        state.lists[index] = action.payload;
      }
      if (state.currentList?.id === action.payload.id) {
        state.currentList = action.payload;
      }
    },
    deleteList: (state, action: PayloadAction<string>) => {
      state.lists = state.lists.filter(l => l.id !== action.payload);
      if (state.currentList?.id === action.payload) {
        state.currentList = null;
      }
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
  setLists,
  setCurrentList,
  addList,
  updateList,
  deleteList,
  setLoading,
  setError,
} = listsSlice.actions;
export default listsSlice.reducer;
