
// data/Reducer.js
const ADD_USER = 'ADD_USER';
const LOAD_USERS = 'LOAD_USERS';


const loadUsers = (state, payload) => {
    return {
      ...state, 
      users: [...payload.users]
    }
  }

const addUser = (state, payload) => {
  console.log('adding user', state);
  return {
    ...state, 
    users: state.users.concat({...payload.user})
  }
}
const initialState = {
  users: []
}
const rootReducer = (state=initialState, action) => {
  switch (action.type) {
    case LOAD_USERS:
        return loadUsers(state, action.payload);
    case ADD_USER:
      return addUser(state, action.payload);
    default:
      return state;
  }
}
export { rootReducer, ADD_USER, LOAD_USERS };