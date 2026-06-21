import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import listsReducer from './slices/listsSlice';
import itemsReducer from './slices/itemsSlice';
import offlineReducer from './slices/offlineSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lists: listsReducer,
    items: itemsReducer,
    offline: offlineReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
