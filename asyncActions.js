const redux = require('redux');
const createStore = redux.createStore;
const applyMiddleWare = redux.applyMiddle;
const thunkMiddleWare = require('redux-thunk').default;
const axios = require('axios');

const initialState = {
  loading: false,
  users: [],
  error: '',
};

const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

const fetchUsersRequest = () => {
  return {
    type: FETCH_USERS_REQUEST,
  };
};

const fetchUsersSuccess = (users) => {
  return {
    type: FETCH_USERS_SUCCESS,
    payload: users,
  };
};

const fetchUsersFailure = (error) => {
  return {
    type: FETCH_USERS_FAILURE,
    payload: error,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
      };
    case FETCH_USERS_FAILURE:
      return {
        loading: false,
        users: [],
        error: action.payload,
      };
  }
};

const fetchUsers = () => {
  return function (dispatch) {
    dispatch(fetchUsersRequest()); // action sets loading to true
    axios
      .get('https://jsonplaceholder.typicode.com/users')
      .then((res) => {
        // response.data is the array of users
        const users = res.data.map((user) => user.id); // returns a new array
        dispatch(fetchUsersSuccess(users));
      })
      .catch((error) => {
        // error.message is the error description
        dispatch(fetchUsersFailure(error.message));
      });
  };
};

const store = createStore(reducer, applyMiddleWare(thunkMiddleWare));
store.subscribe(() => console.log(store.getState()));
store.dispatch(fetchUsers());
