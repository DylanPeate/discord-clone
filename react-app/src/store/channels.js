const LOAD_CHANNELS = 'channels/load'

const getChannels = (channels) => ({
    type: LOAD_CHANNELS,
    payload: channels
})

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
        case LOAD_CHANNELS:
            return { ...state, ...action.payload }
        default:
            return state
    }
}
