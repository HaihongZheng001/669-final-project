const ADD_USER = 'ADD_USER';
const LOAD_USERS = 'LOAD_USERS';
const UPDATE_USER = 'UPDATE_USER';


const initialState = {
  users: [],
}

const addUser = (state, newUser) => {
  let user = {
    ...newUser,
  }
  return {
    ...state, 
    users: [...state.users, user]
  };
}

const loadUsers = (state, users) => {
  return {
    ...state, 
    users: [...users]
  }
}

const updateUser = (state, userId, updatedUser) => {
  let newUser = {...updatedUser};
  return {
    ...state, 
    users: state.users.map(user=>user.id === userId ? newUser : user)
  };
}

const rootReducer = (state=initialState, action) => {
  switch (action.type) {
    case LOAD_USERS:
      return loadUsers(state, action.payload.newUsers);
    case ADD_USER:
      return addUser(state, action.payload.user);
    case UPDATE_USER:
      return updateUser(state, action.payload.id, action.payload.user);
    default:
      return state;
  }
}
export { rootReducer, ADD_USER, LOAD_USERS, UPDATE_USER };