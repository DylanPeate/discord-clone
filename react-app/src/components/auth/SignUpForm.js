import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { signUp } from '../../store/session';

import './signupform.css'

/* eslint-disable no-useless-escape */
//heroku push

const SignUpForm = () => {
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [birthday, setBirthday] = useState('');
  const [submitted, setSubmitted] = useState(false)
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();
    setSubmitted(true)
    if (!errors.length) {
      const data = await dispatch(signUp(username, email, password, birthday));
      if (data) {
        setErrors(data)
      }
    }
  };

  useEffect(() => {
    errorCheck()
  }, [username, email, password, repeatPassword, birthday])

  const errorCheck = () => {
    // e.preventDefault()
    const data = []
    const unReg = /[`!@#$%^&*()+\-=\[\]{};': "\\|,.<>\/?~]/
    const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    //username
    if (unReg.test(username)) {
      data.push('Username must not contain any special characters.')
    }
    if (username.length < 4) {
      data.push('Username must be atleast 4 characters long.')
    }
    if (username.length > 40) {
      data.push('Username must be less than 40 characters')
    }
    //email
    if (!emailReg.test(email)) {
      data.push('Please enter a valid email.')
    }
    //birthday
    function getAge(birthDateString) {
      let today = new Date();
      let birthDate = new Date(birthDateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      let m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
    if (getAge(birthday) <= 13) {
      data.push('Sorry you must be over the age of 13 to use Discord')
    }
    //password
    if (password !== repeatPassword) {
      data.push('Passwords must match.')
    }
    if (password.length < 8) {
      data.push('Passwords must be atleast 8 characters long')
    }
    setErrors(data)
    return data
  }





  if (user) {
    return <Redirect to='/app' />;
  }

  return (
    <div className='background'>
      <div id='signup-container' className='login-container'>
        <div className='login-inner'>
          <div className='login-top-text'>
            <h2 id='top-text'>Create an account</h2>
          </div>
          <form className='login-form' onSubmit={onSignUp}>
            <div>
              {errors.length > 0 && submitted && errors.map((error, ind) => (
                <div className='login-errors' key={ind}>{error}</div>
              ))}
            </div>
            <div className='form-pass'>
              <label>User Name</label>
              <input
                className='login-form-input'
                type='text'
                name='username'
                onChange={e => setUsername(e.target.value)}
                value={username}
              ></input>
            </div>
            <div className='form-email'>
              <label>Email</label>
              <input
                className='login-form-input'
                type='text'
                name='email'
                onChange={e => setEmail(e.target.value)}
                value={email}
              ></input>
            </div>
            <div className='form-pass'>
              <label>Birthday</label>
              <input
                className='login-form-input'
                type='date'
                name='birthday'
                onChange={e => setBirthday(e.target.value)}
                value={birthday}
              ></input>
            </div>
            <div className='form-pass'>
              <label>Password</label>
              <input
                className='login-form-input'
                type='password'
                name='password'
                onChange={e => setPassword(e.target.value)}
                value={password}
              ></input>
            </div>
            <div className='form-pass'>
              <label>Repeat Password</label>
              <input
                className='login-form-input'
                type='password'
                name='repeat_password'
                onChange={e => setRepeatPassword(e.target.value)}
                value={repeatPassword}
                required={true}
              ></input>
            </div>
            <button id='login-submit-btn' type='submit'>Register</button>
            <div className='login-form-btm-text'>
              <a id='signup-goto-login' href='/login'>Already have an account?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


export default SignUpForm;
