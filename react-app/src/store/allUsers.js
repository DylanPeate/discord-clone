const LOAD_USERS = 'session/LOAD_USERS'

const loadUsers = (users) => ({
    type: LOAD_USERS,
    payload: users
})

export const getAllUsers = () => async (dispatch) => {
    const response = await fetch('/api/users/')
    const data = await response.json()
    dispatch(loadUsers(data))
    return data
}




export default function allUsersReducer(state = [], action) {
    switch (action.type) {
        case LOAD_USERS:
            return { ...state, ...action.payload }
        default:
            return state;
    }
}
