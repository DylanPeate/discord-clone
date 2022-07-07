import React, { useState } from 'react'
// import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'


function ProfilePage() {
    const sessionUser = useSelector(state => state.session.user)
    const [image, setImage] = useState(null)
    const [imageLoading, setImageLoading] = useState(false)


    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('image', image)

        setImageLoading(true)

        const res = await fetch('/api/s3/upload/profile_pic', {
            method: "POST",
            body: formData
        })
        if (res.ok) {
            const data = await res.json()
            console.log(data.url, '<---THIS')
            setImageLoading(false)
        } else {
            setImageLoading(false)
            console.log('error')
        }
    }

    const updateImage = e => {
        const file = e.target.files[0];
        setImage(file)
    }


    return (
        <>
            <div>
                Welcome to your profile {sessionUser.username}
            </div>
            <div>
                Your profile picture: <img src={sessionUser.profile_pic}></img>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type='file'
                    accept='image/*'
                    onChange={updateImage}
                ></input>
                <button type='submit'>Submit</button>
                {(imageLoading) && <p>Loading...</p>}
            </form>
        </>
    )
}

export default ProfilePage
