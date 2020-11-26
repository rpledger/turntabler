// Dashboard.js
import React, { Component } from 'react';
import { Redirect, useHistory, withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import TextField from '@material-ui/core/TextField';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Cookies from 'universal-cookie';

const cookies = new Cookies();


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(3)
  },
  gridList: {
     width: 400
  },
  title: {
    flexGrow: 1,
  },
}));

class Dashboard extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      error: null,
      discogsAuthenticated: false,
      discogsUsername: '',
    };
    this.onClickDiscogsLogin = this.onClickDiscogsLogin.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch("/api/discogs/user", {
      method: "get",
    })
    .then(res => res.json())
    .then(
      (result) => {
        if (result["msg"]) {
          this.setState({error: result["msg"]})
        } else if (result["discogsUsername"]) {
          this.setState({
            discogsAuthenticated: true,
            discogsUsername: result["discogsUsername"]
          })
        }
      }
    )
  }

  onClickDiscogsLogin(event) {
    fetch("/api/discogs/url", {
      method: "get",
    })
    .then(res => res.json())
    .then(
      (result) => {
        if (result["url"]) {
          console.log(result["url"])
          // return result["url"]
          var newWindow = window.open(result["url"], 'name', 'height=600,width=450');
          if (window.focus) {
            newWindow.focus();
          }
          // window.location.assign(result["url"]);
          // this.props.history.push(result["url"]);
          // return <Redirect to={result["url"]}/>
        }
      }
    )
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    fetch("/api/discogs/login", {
      method: 'post',
      headers: {
        'X-Csrf-Token': cookies.get('csrf_access_token'),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"oauth_verifier": this.state.verificationCode})
    }).then( res => res.json())
    .then(
      (result) => {
        // console.log("Token: " + result["access_token"])
        // this.props.handleToken(result["access_token"])
        // localStorage.setItem('token', result["access_token"]);
        if (result["discogsUsername"]){
          this.setState({
            discogsAuthenticated: true,
            discogsUsername: result["discogsUsername"]
          })
        }
      }
    )
    event.preventDefault();
  }

  render(){
    if (this.state.discogsAuthenticated){
      return <div><h4>Hello, {this.state.discogsUsername}</h4></div>
    } else {
      return(
        <div>
          <Button variant="contained" color="secondary" onClick={this.onClickDiscogsLogin}>
            Discogs Login
          </Button>
          <form noValidate action="/dasboard" onSubmit={this.handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="verificationCode"
              label="Verification Code"
              name="verificationCode"
              autoComplete="verificationCode"
              autoFocus
              onChange={this.handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Authenticate
            </Button>
            </form>
        </div>
      )
    }

  }

  // render() {
  //   const { error, discogsAuthenticated, discogsUsername } = this.state;
  //   if (error) {
  //     return <Redirect to="/signIn" />; //<div>Error: {error.message}</div>;
  //   } else if (!discogsAuthenticated) {
  //     return <div>Not Authenticated</div>;
  //   } else {
  //     return(
  //       <div>
  //       Hello, {discogsUsername}
  //       </div>
  //     )
  //   }
  // }
}

// export default Dashboard;
export default withRouter(withStyles(useStyles, { withTheme: true })(Dashboard));
