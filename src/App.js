// App.js

import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar />
          <Route exact path="/" component={SignIn} />
          <Route exact path="/signIn" component={SignIn} />
          <Route path="/signUp" component={SignUp} />
        </div>
      </Router>
    );
  }
}

export default App;
