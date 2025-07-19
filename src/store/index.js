import { configureStore } from '@reduxjs/toolkit';
import typesReducer from './typesSlice';

export const store = configureStore({
  reducer: {
    types: typesReducer,
  },
});