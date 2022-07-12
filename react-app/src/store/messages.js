const NEW_MESSAGE = 'messages/new'
const LOAD_MESSAGES = 'messages/load'
const DELETE_MESSAGE = 'messages/del'

const newMessage = (message) => ({
    type: NEW_MESSAGE,
    payload: message,
})

const loadMessages = (messages) => ({
    type: LOAD_MESSAGES,
    payload: messages
})

const delMsg = (messageId) => ({
    type: DELETE_MESSAGE,
    payload: messageId
})


export const editMessage = (message) => async (dispatch) => {
    const response = await fetch(`/api/messages/edit/${message.id}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    })
    if (response.ok) {
        const data = await response.json()
        await dispatch(newMessage(data))
        // await dispatch(getMessages())
        return response
    }
}


export const removeMessage = (messageId) => async (dispatch) => {
    const response = await fetch(`/api/messages/delete/${messageId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.ok) {
        await dispatch(delMsg(messageId))
        return response
    }
}


export const getMessages = () => async (dispatch) => {
    const response = await fetch('/api/messages/load')
    const data = await response.json()
    dispatch(loadMessages(data))
    return data
}



export const sendMessage = (message) => async (dispatch) => {
    const response = await fetch('/api/messages/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    })
    if (response.ok) {
        const data = await response.json()
        await dispatch(newMessage(data))
        await dispatch(getMessages())
    }
    return response
}






export default function messagesReducer(state = [], action) {
    switch (action.type) {
        case NEW_MESSAGE:
            return { ...state }
        case LOAD_MESSAGES:
            return { ...state, ...action.payload }
        case DELETE_MESSAGE:
            // let newState = { ...state }
            delete state[action.payload]
            return { ...state }
        default:
            return state
    }
}
