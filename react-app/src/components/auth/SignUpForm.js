import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { signUp } from '../../store/session';

/* eslint-disable no-useless-escape */
//made local branch

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
    return <Redirect to='/' />;
  }

  return (
    <form onSubmit={onSignUp}>
      <div>
        {errors.length > 0 && submitted && errors.map((error, ind) => (
          <div id='hello' key={ind}>{error}</div>
        ))}
      </div>
      <div>
        <label>User Name</label>
        <input
          type='text'
          name='username'
          onChange={e => setUsername(e.target.value)}
          value={username}
        ></input>
      </div>
      <div>
        <label>Email</label>
        <input
          type='text'
          name='email'
          onChange={e => setEmail(e.target.value)}
          value={email}
        ></input>
      </div>
      <div>
        <label>Birthday</label>
        <input
          type='date'
          name='birthday'
          onChange={e => setBirthday(e.target.value)}
          value={birthday}
        ></input>
      </div>
      <div>
        <label>Password</label>
        <input
          type='password'
          name='password'
          onChange={e => setPassword(e.target.value)}
          value={password}
        ></input>
      </div>
      <div>
        <label>Repeat Password</label>
        <input
          type='password'
          name='repeat_password'
          onChange={e => setRepeatPassword(e.target.value)}
          value={repeatPassword}
          required={true}
        ></input>
      </div>
      <button type='submit'>Sign Up</button>
    </form>
  );
};


export default SignUpForm;
