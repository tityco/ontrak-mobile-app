import { createSlice } from '@reduxjs/toolkit';
const initSate:any[] =   []

const listPathInfoSlice = createSlice({
  name:'listPathInfo',
  initialState: initSate,
  reducers: {
    addTag: (state, action) => {state.push(action.payload)},
    changeTags: (state, action) => {return action.payload},
  }
})

export default listPathInfoSlice;