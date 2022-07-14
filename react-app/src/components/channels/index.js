import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from 'react-router-dom'

import Messages from "../messages";
import { loadChannels, createChannel, deleteChannel, editChannelStore } from "../../store/channels";
import './channels.css'

let socket;
const Channels = (props) => {
    let activeServer = props['activeServer']
    const serverId = activeServer.id
    let default_channel = activeServer['default_channel_id'] //1
    const history = useHistory()
    const dispatch = useDispatch()
    const user = useSelector(state => state.session.user)
    const channelObj = Object.values((useSelector(state => state.channels)))
    const channelList = channelObj.filter(channel => { return channel.server_id === serverId })
    const [activeChannel, setActiveChannel] = useState(default_channel)
    const [newChannelName, setNewChannelName] = useState('')
    const [chEditing, setChEditing] = useState(-1)
    const [chEditInput, setChEditInput] = useState('')



    useEffect(() => {
        setActiveChannel(default_channel)
        if (serverId !== '@me') {
            const channels = dispatch(loadChannels(serverId))
            if (!channels) {
                return (
                    <h2>Loading Channels</h2>
                )
            }
        }
    }, [serverId])

    if (channelList.length < 1) {
        return (
            <h2>loading channels...</h2>
        )
    }

    const changeChannel = (channel) => {
        setActiveChannel(channel)
    }

    const newChannel = () => {
        let channel = {
            owner_id: user.id,
            name: newChannelName,
            channel_type: 'text',
            server_id: serverId,
        }
        dispatch(createChannel(channel))
        setNewChannelName('')
    }

    const delChannel = (channel) => {
        dispatch(deleteChannel(channel))
    }

    const editChannel = (id = -1) => {
        setChEditing(id)
    }

    const editChannelSubmit = (e, channel) => {
        e.preventDefault()

        if (chEditInput === channel.name || chEditInput.length > 30) {
            setChEditing(-1)
        } else {
            const newCh = {
                id: channel.id,
                name: chEditInput,
            }
            dispatch(editChannelStore(newCh))
            setChEditing(-1)
        }
    }

    return (
        <div className="channel-container">
            <div className="channels">
                <div>
                    <input
                        placeholder="new channel"
                        value={newChannelName}
                        required={true}
                        onChange={e => setNewChannelName(e.target.value)}
                    ></input>
                    <button onClick={e => newChannel()}>New</button>
                </div>
                <div>
                    {/* <p>TEXT CHANNELS</p> */}
                    {channelList.map((channel, ind) => (
                        <div key={ind}>
                            {chEditing === channel.id ? <div>
                                <form onSubmit={e => editChannelSubmit(e, channel)}>
                                    <input
                                        required={true}
                                        defaultValue={channel.name}
                                        onChange={e => setChEditInput(e.target.value)}
                                    ></input>
                                    <button type="button" onClick={e => editChannel()}>Cancel</button>
                                </form>
                            </div>
                                :
                                <button onClick={e => changeChannel(channel)}>{channel.name}</button>
                            }
                            {channel.owner_id === user.id ? <div>
                                <button onClick={e => editChannel(channel.id)}>E</button>
                                <button onClick={e => delChannel(channel)}>X</button>
                            </div> : <></>}
                        </div>
                    ))}
                </div>
            </div>
            <div className="message-box-container">
                <Messages activeChannel={activeChannel.id || activeChannel} />
            </div>
        </div>
    )
}

export default Channels
