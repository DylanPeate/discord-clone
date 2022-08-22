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
    const [deleteModal, setDeleteModal] = useState(-1)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const user = useSelector(state => state.session.user)
    const allMsgs = Object.values(useSelector(state => state.messages))
    const [messages, setMessages] = useState(allMsgs)
    const allUsers = Object.values(useSelector(state => state.allUsers))
    const currentUser = useSelector(state => state.session.user)
    const messagesEndRef = useRef(null)


    useEffect(() => {
        (async () => {
            dispatch(getMessages()).then((res) => {
                setMessages(Object.values(res))
            })
        })()
        setMessages(allMsgs)
        socket = io()

        socket.emit("join", activeChannel)

        socket.on('chat', chat => {
            setMessages(messages => [...messages, chat]);
            // dispatch(getMessages())
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

    const deleteMsg = (msg = -1) => {
        setDeleteModal(msg.id)
        delModal()
    }

    const delModal = () => {
        setOpenDeleteModal(!openDeleteModal)
    }

    const delConfirm = async (id) => {
        if (deleteModal > -1) {
            dispatch(removeMessage(deleteModal))
            setDeleteModal(-1)
            delModal()
        }
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
                                                <div>
                                                    {message.user_id === currentUser.id &&
                                                        <div className='msg-btn-container'>
                                                            <img onClick={e => editBtn(message.id)} className='msg-btns' id='edit-msg-btn' src='https://discord-clone-bucket.s3.amazonaws.com/pencil+(1).png'></img>
                                                            <img onClick={e => deleteMsg(message)} className='msg-btns' id='del-msg-btn' src='https://discord-clone-bucket.s3.amazonaws.com/delete.png'></img>
                                                            {/* <button className='msg-btns' onClick={e => deleteMsg(message)}>Delete</button> */}
                                                            {/* <button className='msg-btns' onClick={e => editBtn(message.id)}>Edit</button> */}
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            <div className='msg-body'>
                                                {message.body}
                                            </div>

                                        </div> :
                                        <div className='msg'>
                                            <div className='msg-profile-pic'>
                                                <img id='msg-profile-pic' src={`${getUser(message).profile_pic}`} alt={getUser(message).profile_pic}></img>
                                            </div>
                                            <div className='msg-username'>
                                                {getUser(message).username}
                                            </div>
                                            <div className='msg-body'>
                                                <form className='edit-msg-form' onSubmit={e => editSubmit(e, message)}>
                                                    <input
                                                        className='edit-msg-input'
                                                        required={true}
                                                        defaultValue={message.body}
                                                        onChange={e => setEditInput(e.target.value)}
                                                    ></input>
                                                    {editInput.length > 2000 ? <p id='red-text'>{2000 - editInput.length}</p> : editInput.length > 1799 ? <p>{2000 - editInput.length}</p> : <p></p>}
                                                    <div className='edit-btns'>
                                                        <button className='msg-submit-btn' type='submit' disabled={editDisable()}>
                                                            <img className='cancel-edit-msg-btn' src='https://discord-clone-bucket.s3.amazonaws.com/send-message.png'></img>
                                                        </button>
                                                        <img className='cancel-edit-msg-btn' onClick={e => editBtn()} src='https://discord-clone-bucket.s3.amazonaws.com/cancel.png'></img>
                                                    </div>
                                                    {/* <button type='button' onClick={e => editBtn()}>Cancel</button> */}
                                                </form>
                                            </div>
                                        </div>
                                    }
                                </div>

                            </div> : <div></div>}
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>
            <div className='new-message'>
                <form className='msg-form' onSubmit={sendChat}>
                    <input
                        className='msg-input'
                        placeholder={`Send a new message`}
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                    ></input>
                    <button className='new-msg-btn' disabled={submitDisable()} type="submit">
                        <img className='new-msg-btn-img' src='https://discord-clone-bucket.s3.amazonaws.com/send-message.png' alt='send-msg'></img>
                    </button>
                    {chatInput.length > 2000 ? <p id='red-text'>{2000 - chatInput.length}</p> : chatInput.length > 1799 ? <p>{2000 - chatInput.length}</p> : <p></p>}
                </form>
            </div>
            {
                openDeleteModal && <div className='deleteModalOuter' onClick={e => delModal()} >
                    <div className='deleteModal' onClick={e => e.stopPropagation()}>
                        <div className='delModalText'>
                            <p className='Bold'>Delete Message</p>
                            <p className='small'>Are you sure you want to delete this message?</p>
                        </div>
                        <div className='delModalBtns'>
                            <button className='modalBtn' onClick={e => delModal()}>
                                Cancel
                            </button>
                            <button className='modalBtn redBtn' onClick={e => delConfirm(deleteModal)}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}

export default Messages
