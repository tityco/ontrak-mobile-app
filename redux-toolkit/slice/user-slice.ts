import { createSlice, PayloadAction } from '@reduxjs/toolkit';



const initSate:any = {
  isLogin: true,
  user: {}
}

const userSlice = createSlice({
  name:'user',
  initialState: initSate,
  reducers: {
    setIsLoging: (state: any, action: PayloadAction<any>) => {
      console.log('setIsLoging', action.payload);
      state.isLogin = action.payload;
    },
    setUser: (state: any, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    removeUser: (state: any, action: PayloadAction<any>) => {
      state.user = {};
      state.isLogin = false;
    }
  }
})

export default userSlice;

