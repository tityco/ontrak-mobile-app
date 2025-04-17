import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initSate:any = {
  searchTag: '',
}

const searchSlice = createSlice({
  name:'search',
  initialState: initSate,
  reducers: {
    setSearchTag: (state: any, action: PayloadAction<any>) => {
      state.searchTag = action.payload;
    }
  }
})

export default searchSlice;

