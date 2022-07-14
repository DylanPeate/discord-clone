// constants
const SET_USER = 'session/SET_USER';
const REMOVE_USER = 'session/REMOVE_USER';
const LOAD_USERS = 'session/LOAD_USERS'
const LOAD_SERVERS = 'session/LOAD_SERVERS'

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER,
})

const loadUsers = (users) => ({
  type: LOAD_USERS,
  payload: users
})

const loadServers = (servers) => ({
  type: LOAD_SERVERS,
  payload: servers
})

const initialState = { user: null };

export const getAllUsers = () => async (dispatch) => {
  const response = await fetch('/api/users/')
  const data = await response.json()
  dispatch(loadUsers(data))
  return data
}

export const authenticate = () => async (dispatch) => {
  const response = await fetch('/api/auth/', {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return;
    }
    dispatch(loadUserServers(data.id))
    await dispatch(setUser(data));
  }
}


export const login = (email, password) => async (dispatch) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });


  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data))
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ['An error occurred. Please try again.']
  }

}

export const loadUserServers = (userId) => async (dispatch) => {
  const response = await fetch(`/api/servers/${userId}`)
  if (response.ok) {
    const data = await response.json()
    dispatch(loadServers(data))
  }
}

export const logout = () => async (dispatch) => {
  const response = await fetch('/api/auth/logout', {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (response.ok) {
    dispatch(removeUser());
  }
};


export const signUp = (username, email, password, birthday) => async (dispatch) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      email,
      password,
      birthday
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data))
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ['An error occurred. Please try again.']
  }
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { user: action.payload }
    case LOAD_SERVERS:
      return { ...state, servers: action.payload }
    case REMOVE_USER:
      return { user: null }
    case LOAD_USERS:
      return { ...state, allUsers: action.payload }
    default:
      return state;
  }
}
