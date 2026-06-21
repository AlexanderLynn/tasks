import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  apiKey: string | null;
  isAuthenticated: boolean;
  user: any | null;
}

const initialState: AuthState = {
  apiKey: localStorage.getItem('apiKey'),
  isAuthenticated: !!localStorage.getItem('apiKey'),
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setApiKey: (state, action: PayloadAction<string>) => {
      state.apiKey = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('apiKey', action.payload);
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.apiKey = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('apiKey');
    },
  },
});

export const { setApiKey, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
