export const addTodoList = (data) => {
  return {
    type: 'todoList/addTodo',
    payload: data
  }
}

export const changeUserName = (data) => {
  return {
    type: 'user/changeUserName',
    payload: data
  }
}