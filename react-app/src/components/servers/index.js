import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Channels from "../channels";
import { loadUserServers } from "../../store/session";
import './servers.css'


const Servers = () => {
    const dispatch = useDispatch()
    const serverObj = useSelector(state => state.session.servers)
    const sessionUser = useSelector(state => state.session.user)
    const [activeServer, setActiveServer] = useState({ id: 1, default_channel_id: 1 })

    useEffect(() => {

    }, [serverObj])


    if (!serverObj) {
        dispatch(loadUserServers(sessionUser.id))
        return (
            <h1>Loading servers...</h1>
        )
    }

    const serverList = Object.values(serverObj)

    const changeServer = (server) => {
        setActiveServer(server)
    }

    return (
        <>
            <div className="server-outer-container">
                <div className='servers-container'>
                    {serverList.map((server, ind) => (
                        <div className="server-icon-container" key={ind} >
                            <img onClick={e => changeServer(server)} className="server-icons" src={server.icon}></img>
                            {/* <a href={`/channels/${server.id}/${server.default_channel_id}`}>{server.name}</a> */}
                            {/* <button onClick={e => changeServer(server)}>{server.name}</button> */}
                        </div>
                    ))}
                </div>
                <div className="channel-continer-server">
                    <Channels activeServer={activeServer} />
                </div>
            </div>
        </>
    )
}

export default Servers
