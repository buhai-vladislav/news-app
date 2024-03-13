import { configureStore } from '@reduxjs/toolkit';
import { mainApi } from './api/main.api';
import userReducer from './slices/user.slice';

export const store = configureStore({
  reducer: {
    [mainApi.reducerPath]: mainApi.reducer,
    userSlice: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(mainApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
