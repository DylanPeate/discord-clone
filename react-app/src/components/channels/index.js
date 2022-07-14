import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from 'react-router-dom'

import Messages from "../messages";
import { loadChannels } from "../../store/channels";
import './channels.css'

const Channels = (props) => {
    let activeServer = props['activeServer']
    // console.log(activeServer, "<==ACTIVE SERVER")
    const serverId = activeServer.id
    let default_channel = activeServer['default_channel_id'] //1
    const history = useHistory()
    const dispatch = useDispatch()
    // const serverId = useParams().serverId
    // const channelId = useParams().channelId
    const channelObj = Object.values((useSelector(state => state.channels)))
    const channelList = channelObj.filter(channel => { return channel.server_id === serverId })
    const [activeChannel, setActiveChannel] = useState(default_channel)
    console.log(activeChannel, '<===REFRESH')
    // const channels = dispatch(loadChannels(serverId))


    //get channels for server
    // if (serverId !== '@me') {
    //     const channels = dispatch(loadChannels(serverId))
    //     if (!channels) {
    //         return (
    //             <h2>Loading Channels</h2>
    //         )
    //     }
    // }

    useEffect(() => {
        setActiveChannel(default_channel)
        console.log('CHANNEL CHANGED ON CHANNELS =>', activeChannel)
        if (serverId !== '@me') {
            console.log('loading channels for server -> ', serverId)
            const channels = dispatch(loadChannels(serverId))
            if (!channels) {
                return (
                    <h2>Loading Channels</h2>
                )
            }
        }
    }, [serverId])

    // console.log(channels, "<===HERE")

    if (channelList.length < 1) {
        return (
            <h2>loading channels...</h2>
        )
    }

    const changeChannel = (channel) => {
        // fetch(`/api/messages/join/${channel.id}`)
        setActiveChannel(channel)
    }

    return (
        <div className="channel-container">
            <div>
                {/* <p>TEXT CHANNELS</p> */}
                {channelList.map((channel, ind) => (
                    <div key={ind}>
                        <button onClick={e => changeChannel(channel)}>{channel.name}</button>
                    </div>
                ))}
            </div>
            <div className="message-box-container">
                <Messages activeChannel={activeChannel.id || activeChannel} />
            </div>
        </div>
    )
}

export default Channels
