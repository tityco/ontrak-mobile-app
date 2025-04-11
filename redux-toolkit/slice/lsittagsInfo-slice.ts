import { createSlice } from '@reduxjs/toolkit';
const initSate:any[] =   []

const listTagsInfoSlice = createSlice({
  name:'listTagsInfo',
  initialState: initSate,
  reducers: {
    addTag: (state, action) => {state.push(action.payload)},
    changeTags: (state, action) => {return action.payload},
    updatePositonTag: (state, action) => {

      for (var k = 0; k < action.payload.length; k++) {
        let tagIndex = state.findIndex((item:any) => item.tagID == action.payload[k].tagID);
      
        if (tagIndex != -1) {
  
          if(state[tagIndex].serial == '9000') {
            console.log(">>>>>>>>>>>1", action.payload[k].x,action.payload[k].y)
          }
          state[tagIndex].x = action.payload[k].x;
          state[tagIndex].y = action.payload[k].y;
          
          if(state[tagIndex].serial == '9000') {
            console.log(">>>>>>>>>>>4", state[tagIndex].x, state[tagIndex].y)
          }
        }
      }
    }
  }
})


export default listTagsInfoSlice;