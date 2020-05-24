// App.js

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Navbar from './components/Navbar';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import AlbumList from './components/AlbumList';
import MUITableAlbums from './components/MUITableAlbums';
import MUITableListens from './components/MUITableListens';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      token: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(token) {
    console.log("Token in App: " + token)
    this.setState({token: token});
    return <Redirect to='/albums'  />
  }

  render() {
    return (
      <Router>
        <div>
          <Navbar />
          <Route exact path="/signIn" component={() => <SignIn handleToken={this.handleChange}/>} />
          <Route path="/signUp" component={SignUp} />
          <Route path="/albums" component={() => <MUITableAlbums token={this.state.token}/> } />
          <Route path="/plays" component={() => <MUITableListens token={this.state.token}/> } />
        </div>
      </Router>
    );
  }
}

export default App;
