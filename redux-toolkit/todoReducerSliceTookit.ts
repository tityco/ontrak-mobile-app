
import { createSlice } from '@reduxjs/toolkit';
const initSate =   [
  { id: 1, name: 'Learn React', completed: false, priority: 'high' },
  { id: 2, name: 'Learn Redux', completed: false, priority: 'medium' },
  { id: 3, name: 'Learn JavaScript', completed: true, priority: 'low' },
  { id: 4, name: 'Learn TypeScript', completed: false, priority: 'high' },
  { id: 5, name: 'Learn Node.js', completed: true, priority: 'medium' }
]

const todoSlice = createSlice({
  name:'todo',
  initialState: initSate,
  reducers: {
    addTodo: (state, action) => {state.push(action.payload)},
    deleteTodo: (state, action) => { },
  }
})


export default todoSlice;