import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isLoading } from 'expo-font';



const initSate:any = {
  isLoadingAll: false,
  processLoaidngAll: [],
  isLoadingMapScreen: false,
  processLoadingMapScreen: [],
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
    },
    setLoadingMapScreen: (state: any, action: PayloadAction<any>) => {
      let process = state.processLoadingMapScreen.filter((pro:any) => pro == action.payload);
      if(process.length == 0) {
        state.processLoadingMapScreen.push(action.payload);
      }
      state.isLoadingMapScreen = true;
    },
    removeLoadingMapScreen: (state: any, action: PayloadAction<any>) => {
      state.processLoadingMapScreen = state.processLoadingMapScreen.filter((pro: any) => pro !== action.payload);
      if (state.processLoadingMapScreen.length === 0) {
        state.isLoadingMapScreen = false;
      }
    }
  }
})

export default loadingSlice;

