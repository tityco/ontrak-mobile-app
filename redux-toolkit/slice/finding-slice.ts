import { createSlice, PayloadAction } from '@reduxjs/toolkit';



const initSate:any = {
  selectedStart: null,
  selectedDestination: null,
  isFinding: false,
}

const findingSlice = createSlice({
  name:'finding',
  initialState: initSate,
  reducers: {
    changeStart: (state: any, action: PayloadAction<any>) => {
      state.selectedStart = action.payload;
      if (state.selectedDestination && state.selectedStart) {
        state.isFinding = true;
      }
    },
    chageDestination: (state: any, action: PayloadAction<any>) => {
      state.selectedDestination = action.payload
      if (state.selectedDestination && state.selectedStart) {
        state.isFinding = true;
      }
    }
    
  }
})

export default findingSlice;

