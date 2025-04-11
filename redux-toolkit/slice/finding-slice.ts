import { createSlice, PayloadAction } from '@reduxjs/toolkit';



const initSate:any = {
  selectedStart: null,
  selectedDestination: null
}

const findingSlice = createSlice({
  name:'finding',
  initialState: initSate,
  reducers: {
    changeStart: (state: any, action: PayloadAction<any>) => {
      state.selectedStart = action.payload
    },
    chageDestination: (state: any, action: PayloadAction<any>) => {
      state.selectedDestination = action.payload
    }
    
  }
})

export default findingSlice;

