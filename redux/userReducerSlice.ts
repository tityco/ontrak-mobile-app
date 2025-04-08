
const initSate = {
  name: 'Nguyen Van A',
  email: 'a@gmail.com'
}

const userReducer = (state :any = initSate, action:any ) => {
  switch (action.type) {
    case 'user/changeUserName':
      return {
        ...state,
        name: action.payload
      }
    case 'user/changeEmail':
      return {
        ...state,
        email: action.payload
      }
    default:
      return state
  }
}

export default userReducer;