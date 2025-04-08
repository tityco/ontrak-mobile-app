
import todoReducer from "./todoReducerSlice";
import userReducer from "./userReducerSlice";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  todoList: todoReducer,
  user: userReducer
})
export default rootReducer;

//split
// const rootReducer = (state:any = {}, action:any ) => {
//   return{
//     user: userReducer(state.user, action),
//     todoList: todoReducer(state.todoList, action)
//   }
// }



//co ban
// const initSate = {
//   filter:{
//     search: '',
//     status: 'all',
//     priority: []
//   },
//   todoList:[
//     { id: 1, name: 'Learn React', completed: false, priority: 'high' },
//     { id: 2, name: 'Learn Redux', completed: false, priority: 'medium' },
//     { id: 3, name: 'Learn JavaScript', completed: true, priority: 'low' },
//     { id: 4, name: 'Learn TypeScript', completed: false, priority: 'high' },
//     { id: 5, name: 'Learn Node.js', completed: true, priority: 'medium' }
//   ],
//   user:{
//     name: 'Nguyen Van A',
//   }
// }

// const rootReducer = (state = initSate, action ) => {
//   switch (action.type) {
//     case 'userName/changeUserName':
//       return {
//         ...state,
//         useName: {
//           ...state.useName,
//           name: action.payload
//         }
//       }
//     case 'DELETE_TODO':
//       return {
//         ...state,
//         todoList: state.todoList.filter(todo => todo.id !== action.payload)
//       }
//     case 'UPDATE_TODO':
//       return {
//         ...state,
//         todoList: state.todoList.map(todo => todo.id === action.payload.id ? action.payload : todo)
//       }
//     case 'FILTER_TODO':
//       return {
//         ...state,
//         filter: action.payload
//       }
//     default:
//       return state
//   }
// }

// export default rootReducer;