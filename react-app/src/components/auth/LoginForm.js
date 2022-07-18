import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login } from '../../store/session';
import './LoginForm.css'

const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/app' />;
  }

  return (
    <div className='background'>
      <div className='login-container'>
        <div className='login-inner'>
          <div className='login-top-text'>
            <h2 id='top-text'>Welcome Back</h2>
            <p id='top-text'>We're so excited to see you again!</p>
          </div>
          <form className='login-form' onSubmit={onLogin}>
            <div>
              {errors.map((error, ind) => (
                <div className='login-errors' key={ind}>{error}</div>
              ))}
            </div>
            <div className='form-email'>
              <label className='login-form-label' htmlFor='email'>EMAIL</label>
              <input
                className='login-form-input'
                name='email'
                type='text'
                placeholder='Email'
                required={true}
                value={email}
                onChange={updateEmail}
              />
            </div>
            <div className='form-pass'>
              <label className='login-form-label' htmlFor='password'>PASSWORD</label>
              <input
                className='login-form-input'
                name='password'
                type='password'
                placeholder='Password'
                required={true}
                value={password}
                onChange={updatePassword}
              />

              <button id='login-submit-btn' type='submit'>Login</button>

            </div>
            <div className='login-form-btm-text'>
              <p>{'Need an account? '}</p>
              <a id='login-goto-signup' href='/sign-up'>Register</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
