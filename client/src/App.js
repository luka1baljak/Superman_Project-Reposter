import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import FirstLogin from './components/dashboard/FirstLogin';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profile-form/CreateProfile';
import EditProfile2 from './components/profile-form/EditProfile2';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import SearchPostsByHash from './components/posts/SearchPostsByHash';
import Post from './components/post/Post';
import ScrollUpButton from 'react-scroll-up-button';
//Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import Profiles from './components/profiles/Profiles';
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <ScrollUpButton style={{ backgroundColor: '#723dbe' }} />
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/profiles' component={Profiles} />
              <PrivateRoute exact path='/profile/:id' component={Profile} />
              <Route exact path='/posts' component={Posts} />
              <Route
                exact
                path='/searchPosts/:keyWord'
                component={SearchPostsByHash}
              />
              <PrivateRoute exact path='/firstlogin' component={FirstLogin} />
              <PrivateRoute exact path='/dashboard' component={Dashboard} />
              <PrivateRoute
                exact
                path='/create-profile'
                component={CreateProfile}
              />
              <PrivateRoute
                exact
                path='/edit-profile'
                component={EditProfile2}
              />
              <PrivateRoute exact path='/post/:id' component={Post} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
