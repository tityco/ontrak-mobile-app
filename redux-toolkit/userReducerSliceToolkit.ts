
import { createSlice } from '@reduxjs/toolkit';

const initSate = {
  name: 'Nguyen Van A',
  email: 'a@gmail.com'
}

const userSlice = createSlice({
  name:'user',
  initialState: initSate,
  reducers: {
    changeUserName: (state, action) => {
      state.name = action.payload
    },
    changeEmail: (state, action) => {
      state.email = action.payload
    }
  }
})

export default userSlice;