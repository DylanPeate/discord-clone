const LOAD_CHANNELS = 'channels/load'
const NEW_CHANNEL = 'channels/new'
const DELETE_CHANNEL = 'channels/delete'

const delChannel = (channelId) => ({
    type: DELETE_CHANNEL,
    payload: channelId
})

const getChannels = (channels) => ({
    type: LOAD_CHANNELS,
    payload: channels
})

const newChannel = (channel) => ({
    type: NEW_CHANNEL,
    payload: channel
})

export const editChannelStore = (channel) => async (dispatch) => {
    const response = await fetch(`/api/channels/edit/${channel.id}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(channel)
    })
    if (response.ok) {
        const data = await response.json()
        await dispatch(newChannel(channel))
        return response
    }
}

export const deleteChannel = (channel) => async (dispatch) => {
    const channelId = channel['id']
    const serverId = channel['server_id']
    console.log(channelId, serverId, "<=====")
    const response = await fetch(`/api/channels/${channelId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.ok) {
        await dispatch(delChannel(channelId))
        await dispatch(getChannels(serverId))
        return response
    }
}

export const createChannel = (channel) => async (dispatch) => {
    const response = await fetch('/api/channels/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(channel)
    })
    if (response.ok) {
        const data = await response.json()
        await dispatch(newChannel(data))
        await dispatch(loadChannels(channel.server_id))
        return data
    }
}

export const loadChannels = (serverId) => async (dispatch) => {
    const response = await fetch(`/api/channels/${serverId}`)
    if (response.ok) {
        const data = await response.json()
        await dispatch(getChannels(data))
        return data
    }
}


export default function channelsReducer(state = [], action) {
    switch (action.type) {
        case NEW_CHANNEL:
            return { ...state, ...action.payload }
        case LOAD_CHANNELS:
            return { ...state, ...action.payload }
        case DELETE_CHANNEL:
            delete state[action.payload]
            return { ...state }
        default:
            return state
    }
}
