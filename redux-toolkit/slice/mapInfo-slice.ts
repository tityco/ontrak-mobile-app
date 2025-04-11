
import { createSlice } from '@reduxjs/toolkit';

const initSate:any = null

const mapInfoSlice = createSlice({
  name:'mapInfo',
  initialState: initSate,
  reducers: {
    changeMap: (state:any, action:any) => {
      return action.payload
    },
   
  }
})

export default mapInfoSlice;