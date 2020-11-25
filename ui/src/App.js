// App.js

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Navbar from './components/Navbar';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import AlbumList from './components/AlbumList';
import MUITableAlbums from './components/MUITableAlbums';
import MUITableListens from './components/MUITableListens';

class App extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <Router>
        <div>
          <Navbar />
          <Route exact path="/" component={SignIn} />
          <Route exact path="/signIn" component={SignIn} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/signUp" component={SignUp} />
          <Route path="/albums" component={MUITableAlbums} />
          <Route path="/plays" component={MUITableListens} />
        </div>
      </Router>
    );
  }
}

export default App;
