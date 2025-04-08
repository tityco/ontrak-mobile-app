
import { createSlice } from '@reduxjs/toolkit';

const initSate = {}

const mapInfoSlice = createSlice({
  name:'mapInfo',
  initialState: initSate,
  reducers: {
    changeMap: (state, action) => {
      return action.payload
    },
   
  }
})

export default mapInfoSlice;