import { io } from 'socket.io-client'
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from 'react-router-dom'
import { logout } from '../../store/session';
import Messages from "../messages";
import { loadChannels, createChannel, deleteChannel, editChannelStore, updateDelete } from "../../store/channels";
import './channels.css'

let socket;
const Channels = (props) => {
    let activeServer = props['activeServer']
    const serverId = activeServer.id
    let default_channel = activeServer['default_channel_id'] //1
    const history = useHistory()
    const dispatch = useDispatch()
    const user = useSelector(state => state.session.user)
    const serverList = useSelector(state => state.session.servers)
    const channelObj = Object.values((useSelector(state => state.channels)))
    const channelList = channelObj.filter(channel => { return channel.server_id === serverId })
    const [activeChannel, setActiveChannel] = useState(default_channel)
    const [newChannelName, setNewChannelName] = useState('')
    const [chEditing, setChEditing] = useState(-1)
    const [chEditInput, setChEditInput] = useState('')
    const [editErrors, setEditErrors] = useState([])
    const [errors, setErrors] = useState([])
    const [channelSubmitted, setChannelSubmitted] = useState(false)
    const [newChannelModal, setNewChannelModal] = useState(false)
    //heroku push
    useEffect(() => {
        socket = io()

        socket.on('newChannel', channel => {
            dispatch(loadChannels(serverId))
            console.log('new channel event')
        })

        socket.on('delChannel', channel => {
            //del fix?
            dispatch(updateDelete(channel))
            console.log('Del channel')
        })

        socket.on('editChannel', channel => {
            dispatch(loadChannels(serverId))
            console.log('edit channel event')
        })

    }, [])



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

    const channelValidate = () => {
        const data = []
        if (newChannelName.length > 25) {
            data.push('Name can not be longer than 25 characters.')
        }
        if (newChannelName.length < 1) {
            data.push('Name required')
        }
        setErrors(data)
        if (data.length > 0) {
            return true
        } else {
            return false
        }
    }

    const editChannelValidate = () => {
        const data = []
        if (chEditInput.length > 25) {
            data.push('Name can not be longer than 25 characters.')
        }
        if (chEditInput.length < 1) {
            data.push('Name required')
        }
        setEditErrors(data)
        if (data.length > 0) {
            return true
        } else {
            return false
        }
    }

    useEffect(() => {
        // console.log(errors, channelSubmitted, "<======")
        channelValidate()
    }, [newChannelName])
    useEffect(() => {
        // console.log(errors, channelSubmitted, "<======")
        editChannelValidate()
    }, [chEditInput])

    if (channelList.length < 1) {
        return (
            <h2>loading channels...</h2>
        )
    }

    const changeChannel = (channel) => {
        setActiveChannel(channel)
    }

    const newChannel = () => {
        setChannelSubmitted(true)
        // channelValidate()
        if (!errors.length) {
            let channel = {
                owner_id: user.id,
                name: newChannelName,
                channel_type: 'text',
                server_id: serverId,
            }
            dispatch(createChannel(channel))
            setNewChannelName('')
            setNewChannelModal(!newChannelModal)
        }
    }

    const delChannel = (channel) => {
        dispatch(deleteChannel(channel))
    }

    const editChannel = (id = -1) => {
        setChEditing(id)
    }

    const editChannelSubmit = (e, channel) => {
        e.preventDefault()
        if (chEditInput === channel.name || chEditInput === '') {
            setChEditing(-1)
        } else {
            const newCh = {
                id: channel.id,
                name: chEditInput,
            }
            dispatch(editChannelStore(newCh))
            setChEditing(-1)
        }
        setChEditInput('')
    }

    const openNewChannelModal = () => {
        setNewChannelModal(!newChannelModal)
    }

    const logOutUser = () => {
        dispatch(logout())
    }

    return (
        <>
            {newChannelModal && <div className='new-channel-modal'>
                <div className='new-ch-overlay' onClick={e => openNewChannelModal(e)}></div>
                <div className='new-ch-content'>
                    <div>
                        <div className='new-ch-top-text'>
                            <h3>Create Channel</h3>
                            <p>in Text Channels</p>
                        </div>
                        <div className='text-ch-placeholder'>
                            <div className='text-ch-symbol'>
                                <h2>#</h2>
                            </div>
                            <div className='text-ch-inner'>
                                <p>Text</p>
                                <p id='txt-ch-msg'>Send messages, opinions, and puns</p>
                            </div>
                        </div>
                        <p id='label-top-text'>CHANNEL NAME</p>
                        <div className='new-ch-input-container'>
                            <div id='ch-input-txt'>#</div>
                            <input
                                id='new-ch-input'
                                placeholder="new-channel"
                                value={newChannelName}
                                required={true}
                                onChange={e => setNewChannelName(e.target.value)}
                            ></input>
                        </div>
                        {newChannelName.length > 25 ? <div className='red-text'>{25 - newChannelName.length}</div> : newChannelName.length > 20 ? <div>{25 - newChannelName.length}</div> : <div></div>}
                        <div className='new-ch-btns'>
                            <button id='cancel-new-ch' onClick={e => openNewChannelModal(e)}>Cancel</button>
                            <button id='submit-new-ch' onClick={e => newChannel()} disabled={errors.length}>Create Channel</button>
                        </div>
                    </div>
                </div>
            </div>}
            <div className="channel-container">
                <div className="channels">
                    <div className='channel-name'>
                        {serverList[serverId].name}
                    </div>
                    <div className='channels-banner'>
                        <p id='text-banner'>TEXT CHANNELS</p>
                        <button className='open-new-channel-modal' onClick={e => openNewChannelModal(e)}>
                            <img id='new-ch-img' src='https://discord-clone-bucket.s3.amazonaws.com/white-plus.png' alt='add new channel'></img>
                        </button>
                    </div>
                    <div>
                        {errors.length > 0 && channelSubmitted && errors.map((error, ind) => {
                            <div key={ind} className='new-channel-errors'>Error: {error}</div>
                            { console.log('should be showing errors', error) }
                        })}
                    </div>
                    <div className='channels-list'>
                        {/* <p>TEXT CHANNELS</p> */}
                        {channelList.map((channel, ind) => (
                            <div key={ind} className='channel' onClick={e => changeChannel(channel)}>
                                {chEditing === channel.id ? <div className='editing-ch'>
                                    <form onSubmit={e => editChannelSubmit(e, channel)}>
                                        <input
                                            id='ch-edit-input'
                                            required={true}
                                            defaultValue={channel.name}
                                            onChange={e => setChEditInput(e.target.value)}
                                        ></input>
                                        <button id='edit-smb-btn' type='submit' disabled={editErrors.length}></button>
                                        <button id='ch-edit-input-cancel' type="button" onClick={e => editChannel()}>
                                            <img id='ch-edit-img' src='https://discord-clone-bucket.s3.amazonaws.com/cancel.png'></img>
                                        </button>
                                        {chEditInput.length > 25 ? <div className='red-text'>{25 - chEditInput.length}</div> : chEditInput.length > 20 ? <div>{25 - chEditInput.length}</div> : <div></div>}
                                    </form>
                                </div>
                                    :
                                    <div onClick={e => changeChannel(channel)} className='channel-div'>
                                        <div className='channel-info'>
                                            # {channel.name}
                                        </div>
                                    </div>
                                }
                                {channel.owner_id === user.id && chEditing !== channel.id ? <div className='ch-edit-btns'>
                                    <div id='ch-open-edit-btn' onClick={e => editChannel(channel.id)}>
                                        <img id='ch-del-img' alt='edit-img' src='https://discord-clone-bucket.s3.amazonaws.com/pencil+(1).png'></img>
                                    </div>
                                    <div id='ch-delete-btn' onClick={e => delChannel(channel)}>
                                        <img id='ch-del-img' src='https://discord-clone-bucket.s3.amazonaws.com/delete.png' alt='del-btn'></img>
                                    </div>
                                </div> : <></>}
                            </div>
                        ))}
                    </div>
                    <div className='user-info'>
                        <img id='msg-profile-pic' src={user.profile_pic} alt='user-profile-pic'></img>
                        <p>{user.username}</p>
                        <button id='logout-btn' onClick={() => logOutUser()}>
                            logout
                        </button>
                    </div>
                </div>
                <div className="message-box-container">
                    <Messages activeChannel={activeChannel.id || activeChannel} />
                </div>
            </div>
        </>
    )
}

export default Channels
