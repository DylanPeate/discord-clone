import { io } from 'socket.io-client'
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import messagesReducer, { sendMessage, getMessages, removeMessage } from '../../store/messages'
let socket;


const Messages = () => {
    const dispatch = useDispatch()
    const [chatInput, setChatInput] = useState('')
    const [messages, setMessages] = useState([])
    const [deleted, setDeleted] = useState([])
    const [loaded, setLoaded] = useState(false)
    const user = useSelector(state => state.session.user)
    const allMsgs = Object.values(useSelector(state => state.messages))
    const allUsers = Object.values(useSelector(state => state.allUsers))
    const currentUser = useSelector(state => state.session.user)




    //test push
    // useEffect(() => {
    //     console.log(messages, '<==ALLMSGS, disp')
    //     setMessages(allMsgs)
    // }, [dispatch, deleted])

    useEffect(() => {
        setMessages(allMsgs)
        socket = io()
        socket.on('chat', chat => {
            setMessages(messages => [...messages, chat])
        })

        socket.on('delMsg', msgId => {
            console.log('deleted message')
            dispatch(getMessages())
            console.log(allMsgs, '<==ALLMSGS')
            setMessages(allMsgs)
        })

        return (() => {
            socket.disconnect()
            console.log('disconnected')
        })
    }, [])

    useEffect(() => {
        if (!loaded) {
            setMessages(allMsgs)
        } else {
            setLoaded(true)
        }
    }, [])

    const sendChat = (e) => {
        e.preventDefault()
        // socket.emit('chat', { user: user.username, msg: chatInput, profile_pic: user.profile_pic })
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
        dispatch(getMessages())
        // setDeleted([msg])
        // console.log(messages, '<==ALLMSGS, del')
    }
    // const editMsg = (msg) => {
    //     return null
    // }


    return (user &&
        <div>
            <div>
                <p>Messages Length:</p>
                {messages.length}
            </div>
            <div>
                {messages.map((message, ind) => (
                    <div key={ind} className='message-container'>
                        <div>{`${getUserName(message)}: ${message.body}`}</div>
                        {message.user_id === currentUser.id &&
                            <button onClick={e => deleteMsg(message)}>Delete</button>}
                        {/* <button onClick={editMsg(message)}>Edit</button> */}
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
