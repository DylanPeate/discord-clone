import { io } from 'socket.io-client'
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
let socket;

const Messages = () => {
    const [chatInput, setChatInput] = useState('')
    const [messages, setMessages] = useState([])
    const user = useSelector(state => state.session.user)

    useEffect(() => {
        socket = io()
        console.log(socket, "<--Socket")
        socket.on('chat', chat => {
            setMessages(messages => [...messages, chat])
            console.log(messages, '<------messages')
        })

        return (() => {
            socket.disconnect()
            console.log('disconnected')
        })
    }, [])

    const sendChat = (e) => {
        e.preventDefault()
        socket.emit('chat', { user: user.username, msg: chatInput })
        setChatInput('')
    }

    return (user &&
        <div>
            <div>
                <p>Messages Length:</p>
                {messages.length}
            </div>
            <div>
                {messages.map((message, ind) => (
                    <div key={ind}>{`${message.user}: ${message.msg}`}</div>
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
