import { createSlice, PayloadAction } from '@reduxjs/toolkit';



const initSate:any = {
  isLoadingAll: false,
  processLoaidngAll: []
}

const loadingSlice = createSlice({
  name:'loading',
  initialState: initSate,
  reducers: {
    setLoadingAll: (state: any, action: PayloadAction<any>) => {
      let process = state.processLoaidngAll.filter((pro:any) => pro == action.payload);
      if(process.length == 0) {
        state.processLoaidngAll.push(action.payload);
      }
      state.isLoadingAll = true;
    },
    removeLoadingAll: (state: any, action: PayloadAction<any>) => {
      state.processLoaidngAll = state.processLoaidngAll.filter((pro: any) => pro !== action.payload);
      if (state.processLoaidngAll.length === 0) {
        state.isLoadingAll = false;
      }
    }
    
  }
})

export default loadingSlice;

