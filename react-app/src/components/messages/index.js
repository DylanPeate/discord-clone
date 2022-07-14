import { io } from 'socket.io-client'
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import messagesReducer, { sendMessage, getMessages, removeMessage, editMessage } from '../../store/messages'
let socket;


const Messages = (props) => {
    console.log(props, "<===HERE PROPS")
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


    useEffect(() => {
        console.log('ACTIVE CHANNEL CHANGED IN MESSAGES TO -->', activeChannel)
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

    function getUserName(msg) {
        for (let i = 0; i < allUsers.length; i++) {
            if (allUsers[i].id === msg.user_id) {
                return allUsers[i].username
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


    return (user &&
        <div className='message-box'>
            <div>
                {messages?.map((message, ind) => (
                    <div key={ind}>
                        {message.channel_id === activeChannel ?
                            <div className='message-container'>
                                <div>
                                    {editing !== message.id ?
                                        <div>{`${getUserName(message)}: ${message.body}`}</div> :
                                        <div>
                                            <form onSubmit={e => editSubmit(e, message)}>
                                                <input
                                                    defaultValue={message.body}
                                                    onChange={e => setEditInput(e.target.value)}
                                                ></input>
                                            </form>
                                        </div>
                                    }
                                    <div>
                                        {message.user_id === currentUser.id &&
                                            <div>
                                                <button onClick={e => deleteMsg(message)}>Delete</button>
                                                <button onClick={e => editBtn(message.id)}>Edit</button>
                                                <button onClick={e => editBtn()}>Cancel</button>
                                            </div>
                                        }
                                    </div>
                                </div>

                            </div> : <div></div>}
                    </div>
                ))}
            </div>
            <form onSubmit={sendChat}>
                <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                ></input>
                <button disabled={submitDisable()} type="submit">Send</button>
                <p>{2000 - chatInput.length}</p>
            </form>
        </div>

    )
}

export default Messages
