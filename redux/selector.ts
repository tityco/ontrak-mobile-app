//reskect
import { createSelector } from "reselect"

export const userNameSelector = (state) => state.user.name
export const todoListSelector = (state) => state.todoList

export const filterSelector =createSelector(userNameSelector, todoListSelector, (username,dotoList)=>{
  return dotoList.filter((todo) => {
    return todo.name.toLowerCase().includes(username)
  })
})


