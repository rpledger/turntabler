// App.js

import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar />
          <Route exact path="/signIn" component={SignIn} />
          <Route path="/signUp" component={SignUp} />
          <Route path="/" component={Dashboard} />
        </div>
      </Router>
    );
  }
}

export default App;
