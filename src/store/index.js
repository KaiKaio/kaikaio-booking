import { configureStore } from '@reduxjs/toolkit'
import typesReducer from '@/store/typesSlice'

export const store = configureStore({
  reducer: {
    types: typesReducer
  },
})