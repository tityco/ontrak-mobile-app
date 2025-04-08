
const initSate =   [
  { id: 1, name: 'Learn React', completed: false, priority: 'high' },
  { id: 2, name: 'Learn Redux', completed: false, priority: 'medium' },
  { id: 3, name: 'Learn JavaScript', completed: true, priority: 'low' },
  { id: 4, name: 'Learn TypeScript', completed: false, priority: 'high' },
  { id: 5, name: 'Learn Node.js', completed: true, priority: 'medium' }
]

const todoReducer = (state :any = initSate, action:any ) => {
  switch (action.type) {
    case 'todo/add':
      return  [...state, action.payload]
    default:
      return state
  }
}

export default todoReducer;