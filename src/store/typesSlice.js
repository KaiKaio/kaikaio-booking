import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  types: [],
}

export const typesSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setTypes: (state, action) => {
      state.types = action.payload
    }
  },
})

export const { setTypes } = typesSlice.actions

export default typesSlice.reducer