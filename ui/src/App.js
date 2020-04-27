// App.js

import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import AlbumList from './components/AlbumList';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar />
          <Route exact path="/signIn" component={SignIn} />
          <Route path="/signUp" component={SignUp} />
          <Route path="/albums" component={AlbumList} />
        </div>
      </Router>
    );
  }
}

export default App;
