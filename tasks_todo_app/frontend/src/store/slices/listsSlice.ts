import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { List, ListMember } from '../../services/listsApi';

interface ListsState {
  lists: List[];
  members: Record<string, ListMember[]>;
  currentList: List | null;
  loading: boolean;
  error: string | null;
}

const initialState: ListsState = {
  lists: [],
  members: {},
  currentList: null,
  loading: false,
  error: null,
};

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    setLists: (state, action: PayloadAction<{ lists: List[]; members?: Record<string, ListMember[]> }>) => {
      state.lists = action.payload.lists;
      if (action.payload.members) {
        state.members = action.payload.members;
      }
    },
    setCurrentList: (state, action: PayloadAction<List | null>) => {
      state.currentList = action.payload;
    },
    setMembers: (state, action: PayloadAction<{ listId: string; members: ListMember[] }>) => {
      state.members[action.payload.listId] = action.payload.members;
    },
    addMember: (state, action: PayloadAction<ListMember>) => {
      const members = state.members[action.payload.listId] ?? [];
      state.members[action.payload.listId] = [...members.filter((m) => m.id !== action.payload.id), action.payload];
    },
    updateMember: (state, action: PayloadAction<ListMember>) => {
      const members = state.members[action.payload.listId] ?? [];
      state.members[action.payload.listId] = members.map((member) =>
        member.id === action.payload.id ? action.payload : member
      );
    },
    removeMember: (state, action: PayloadAction<{ listId: string; userId: string }>) => {
      state.members[action.payload.listId] = (state.members[action.payload.listId] ?? []).filter(
        (member) => member.userId !== action.payload.userId
      );
    },
    addList: (state, action: PayloadAction<List>) => {
      state.lists.push(action.payload);
    },
    updateList: (state, action: PayloadAction<List>) => {
      const index = state.lists.findIndex(l => l.id === action.payload.id);
      if (index !== -1) {
        state.lists[index] = action.payload;
      } else {
        state.lists.push(action.payload);
      }
      if (state.currentList?.id === action.payload.id) {
        state.currentList = action.payload;
      }
    },
    deleteList: (state, action: PayloadAction<string>) => {
      state.lists = state.lists.filter(l => l.id !== action.payload);
      delete state.members[action.payload];
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
  setMembers,
  addMember,
  updateMember,
  removeMember,
  addList,
  updateList,
  deleteList,
  setLoading,
  setError,
} = listsSlice.actions;
export default listsSlice.reducer;
