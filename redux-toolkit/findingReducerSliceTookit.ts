import { createSlice } from '@reduxjs/toolkit';

const initSate = {
  selectedStart: '',
  selectedDestination: ''
}

const findingSlice = createSlice({
  name:'finding',
  initialState: initSate,
  reducers: {
    changeStart: (state, action) => {
      state.selectedStart = action.payload
    },
    chageDestination: (state, action) => {
      state.selectedDestination = action.payload
    }
    
  }
})

export default findingSlice;