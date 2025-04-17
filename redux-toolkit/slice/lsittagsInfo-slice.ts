import { createSlice } from '@reduxjs/toolkit';
const initSate:any[] =   []

const listTagsInfoSlice = createSlice({
  name:'listTagsInfo',
  initialState: initSate,
  reducers: {
    addTag: (state, action) => {state.push(action.payload)},
    changeTags: (state, action) => {return action.payload},
    updateTag: (state, action) => {
      const updatedTags = action.payload; 
      updatedTags.forEach((updatedTag: any) => {
        const tag = state.find((item: any) => item.tagID === updatedTag.tagID);
        if (tag) {
          tag.x = updatedTag.x;
          tag.y = updatedTag.y;
          tag.status = updatedTag.status;
        }
      });
    }
  }
})


export default listTagsInfoSlice;