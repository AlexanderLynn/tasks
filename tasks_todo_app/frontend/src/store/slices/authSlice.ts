import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storage } from '../../services/storage';

interface AuthState {
  apiKey: string | null;
  isAuthenticated: boolean;
  user: any | null;
}

const initialState: AuthState = {
  apiKey: storage.getApiKey(),
  isAuthenticated: !!storage.getApiKey(),
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setApiKey: (state, action: PayloadAction<string>) => {
      state.apiKey = action.payload;
      state.isAuthenticated = true;
      storage.setApiKey(action.payload);
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.apiKey = null;
      state.isAuthenticated = false;
      state.user = null;
      storage.removeApiKey();
      storage.clearCache();
    },
  },
});

export const { setApiKey, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
