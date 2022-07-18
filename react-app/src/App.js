import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UsersList from './components/UsersList';
import User from './components/User';
import ProfilePage from './components/profilePage';
import Messages from './components/messages';
import Servers from './components/servers'
import Channels from './components/channels';
import SplashPage from './components/splashpage';
import { authenticate } from './store/session';
import { getAllUsers } from './store/allUsers';
import { getMessages } from './store/messages';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      await dispatch(getAllUsers())
      await dispatch(getMessages())
      setLoaded(true);
    })();
  }, [dispatch]);

  const sessionUser = useSelector(state => state.session.user)

  if (!loaded) {
    return <SplashPage />;
  }

  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute path='/me'>
          <ProfilePage />
        </ProtectedRoute>
        <Route path='/login' exact={true}>
          <LoginForm />
        </Route>
        <Route path='/sign-up' exact={true}>
          <SignUpForm />
        </Route>
        <Route path='/' exact={true} >
          {sessionUser ? <Servers /> : <SplashPage />}
        </Route>
        <ProtectedRoute path='/app' exact={true} >
          {sessionUser ? <Servers /> : <SplashPage />}
        </ProtectedRoute>
        <Route>
          {sessionUser ? <Servers /> : <SplashPage />}
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
