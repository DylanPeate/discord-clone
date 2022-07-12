import { io } from 'socket.io-client'
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import messagesReducer, { sendMessage, getMessages, removeMessage, editMessage } from '../../store/messages'
let socket;


const Messages = () => {
    const dispatch = useDispatch()
    const [chatInput, setChatInput] = useState('')
    const [editInput, setEditInput] = useState('')
    const [deleted, setDeleted] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [editing, setEditing] = useState(-1)
    const user = useSelector(state => state.session.user)
    const allMsgs = Object.values(useSelector(state => state.messages))
    const [messages, setMessages] = useState(allMsgs)
    const allUsers = Object.values(useSelector(state => state.allUsers))
    const currentUser = useSelector(state => state.session.user)



    useEffect(() => {
        setMessages(allMsgs)
        socket = io()
        socket.on('chat', chat => {
            console.log(chat, "<===THIS")
            setMessages(messages => [...messages, chat])
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
    }, [])

    const sendChat = (e) => {
        e.preventDefault()
        const newMsg = {
            user_id: user.id,
            username: user.username,
            body: chatInput,
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
        console.log(editing, '<===EDITING')
    }
    const editSubmit = (e, message) => {
        e.preventDefault()
        const newMsg = {
            id: message.id,
            body: editInput,
        }
        dispatch(editMessage(newMsg))
        setEditing(-1)
    }


    return (user &&
        <div>
            <div>
                <p>Messages Length:</p>
                {messages?.length}
            </div>
            <div>
                {messages?.map((message, ind) => (
                    <div key={ind} className='message-container'>

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




                        {message.user_id === currentUser.id &&
                            <>
                                <button onClick={e => deleteMsg(message)}>Delete</button>
                                <button onClick={e => editBtn(message.id)}>Edit</button>
                                <button onClick={e => editBtn()}>Cancel</button>
                            </>
                        }
                    </div>
                ))}
            </div>
            <form onSubmit={sendChat}>
                <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                ></input>
                <button type="submit">Send</button>
            </form>
        </div>

    )
}

export default Messages
