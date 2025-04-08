import { createSlice } from '@reduxjs/toolkit';
const initSate:any[] =   []

const tagsInfoSlice = createSlice({
  name:'tagsInfo',
  initialState: initSate,
  reducers: {
    addTag: (state, action) => {state.push(action.payload)},
    changeTags: (state, action) => {return action.payload},
  }
})


export default tagsInfoSlice;