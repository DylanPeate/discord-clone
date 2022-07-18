import React from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/session';
// import { Route, Redirect } from 'react-router-dom';
import './splashpage.css'

function SplashPage() {
    const dispatch = useDispatch()
    let history = useHistory()

    const demoLogin = () => {
        console.log('hit demo login')
        const email = 'demo@aa.io'
        const password = 'password'

        return dispatch(login(email, password))
    }

    return (
        <div className='splash-page'>
            <div className='top-bar'>
                <div className='logo'>
                    <img id='dc-logo' src='https://discord-clone-bucket.s3.amazonaws.com/Discord-logo-white.png' alt='logo'></img>
                </div>
                <div className='nav-links'>
                    <a className='nav-link' href='https://github.com/DylanPeate'>GitHub</a>
                    <a className='nav-link' href='https://www.linkedin.com/in/dylan-peate-839511231/'>LinkdIn</a>
                </div>
                <div className='top-right'>
                    <button id='login-btn' onClick={() => history.push('/login')}>Login</button>
                </div>
            </div>
            <div className='hero-text'>
                <div className='banner'>
                    <h2>IMAGINE A PLACE...</h2>
                    <p id='hero-sub-text'>...where you can belong to a school club, a gaming group, or a worldwide art community. Where just you and a handful of friends can spend time together. A place that makes it easy to talk every day and hang out more often.</p>
                </div>
                <div className='hero-btns'>
                    <div>
                        <button className='hero-btn' id='signup-btn' onClick={() => history.push('/sign-up')}>Sign Up</button>
                    </div>
                    <div>
                        <button className='hero-btn' id='demo-btn' onClick={() => demoLogin()}>Demo</button>
                    </div>
                </div>
            </div >
            <img id='splash-background' src='https://discord-clone-bucket.s3.amazonaws.com/discord_background.jpg' alt='background-img'></img>
        </div >
    )
}

export default SplashPage
