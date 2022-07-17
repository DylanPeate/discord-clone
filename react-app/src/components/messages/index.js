import { io } from 'socket.io-client'
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import messagesReducer, { sendMessage, getMessages, removeMessage, editMessage } from '../../store/messages'
import './messages.css'
let socket;


const Messages = (props) => {
    const activeChannel = props.activeChannel
    const dispatch = useDispatch()
    const [chatInput, setChatInput] = useState('')
    const [editInput, setEditInput] = useState('')
    const [editing, setEditing] = useState(-1)
    const user = useSelector(state => state.session.user)
    const allMsgs = Object.values(useSelector(state => state.messages))
    const [messages, setMessages] = useState(allMsgs)
    const allUsers = Object.values(useSelector(state => state.allUsers))
    const currentUser = useSelector(state => state.session.user)
    const messagesEndRef = useRef(null)


    useEffect(() => {
        setMessages(allMsgs)
        socket = io()

        socket.emit("join", activeChannel)

        socket.on('chat', chat => {
            setMessages(messages => [...messages, chat]);
        })

        socket.on('delMsg', msgId => {
            (async () => {
                dispatch(getMessages()).then((res) => {
                    setMessages(Object.values(res))
                })
            })()
        })

        socket.on('edit', msg => {
            (async () => {
                dispatch(getMessages()).then((res) => {
                    setMessages(Object.values(res))
                })
            })()
        })

        return (() => {
            socket.disconnect()
            console.log('disconnected')
        })
    }, [activeChannel])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView()
    }, [messages])

    const sendChat = (e) => {
        e.preventDefault()
        const newMsg = {
            user_id: user.id,
            username: user.username,
            body: chatInput,
            channel_id: activeChannel,
        }
        dispatch(sendMessage(newMsg))
        setChatInput('')
    }

    function getUser(msg) {
        for (let i = 0; i < allUsers.length; i++) {
            if (allUsers[i].id === msg.user_id) {
                return allUsers[i]
            }
        }
    }

    const deleteMsg = async (msg) => {
        dispatch(removeMessage(msg.id))
    }

    const editBtn = (id = -1) => {
        setEditing(id)
    }

    const editSubmit = (e, message) => {
        e.preventDefault()
        if (editInput === message.body) {
            setEditing(-1)
        } else {
            const newMsg = {
                id: message.id,
                body: editInput,
            }
            dispatch(editMessage(newMsg))
            setEditing(-1)
        }
    }

    const submitDisable = () => {
        if (!chatInput.length) return true
        if (chatInput.length > 2000) return true
        else return false
    }

    const editDisable = () => {
        if (!editInput.length) return true
        if (editInput.length > 2000) return true
        else return false
    }


    return (user &&
        <div className='message-box'>
            <div className='messages'>
                {messages?.map((message, ind) => (
                    <div key={ind}>
                        {message.channel_id === activeChannel ?
                            <div className='message-container'>
                                <div>
                                    {editing !== message.id ?
                                        <div className='msg'>
                                            <div className='msg-profile-pic'>
                                                <img id='msg-profile-pic' src={`${getUser(message).profile_pic}`} alt={getUser(message).profile_pic}></img>
                                            </div>
                                            <div className='msg-username'>
                                                {getUser(message).username}
                                            </div>
                                            <div className='msg-body'>
                                                {message.body}
                                            </div>
                                        </div> :
                                        <div>
                                            <form onSubmit={e => editSubmit(e, message)}>
                                                <input
                                                    required={true}
                                                    defaultValue={message.body}
                                                    onChange={e => setEditInput(e.target.value)}
                                                ></input>
                                                {editInput.length > 2000 ? <p id='red-text'>{2000 - editInput.length}</p> : editInput.length > 1799 ? <p>{2000 - editInput.length}</p> : <p></p>}
                                                <button type='submit' disabled={editDisable()}>submit</button>
                                                <button type='button' onClick={e => editBtn()}>Cancel</button>
                                            </form>
                                        </div>
                                    }
                                    <div>
                                        {message.user_id === currentUser.id &&
                                            <div className='msg-btns'>
                                                <button onClick={e => deleteMsg(message)}>Delete</button>
                                                <button onClick={e => editBtn(message.id)}>Edit</button>
                                            </div>
                                        }
                                    </div>
                                </div>

                            </div> : <div></div>}
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>
            <div className='new-message'>
                <form onSubmit={sendChat}>
                    <input
                        className='msg-input'
                        placeholder={`Send a new message`}
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                    ></input>
                    <button disabled={submitDisable()} type="submit">Send</button>
                    {/* {chatInput.length > 1799 ? <p>{2000 - chatInput.length}</p> : chatInput.length > 2000 ? <p id='red-text'>{2000 - chatInput.length}</p> : <p></p>} */}
                    {chatInput.length > 2000 ? <p id='red-text'>{2000 - chatInput.length}</p> : chatInput.length > 1799 ? <p>{2000 - chatInput.length}</p> : <p></p>}
                </form>
            </div>
        </div>

    )
}

export default Messages
