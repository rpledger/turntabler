// Dashboard.js
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import CssBaseline from '@material-ui/core/CssBaseline';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Cookies from 'universal-cookie';
import Container from '@material-ui/core/Container';


const cookies = new Cookies();


const useStyles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class Dashboard extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
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
            isLoaded: true,
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
    const { classes } = this.props;
    if (this.state.error && this.state.error != "No Discogs credentials") {
      return <Redirect to="/signIn" />;
    } else if (!this.state.isLoaded && !this.state.error) {
      return <div></div>;
    } else if (this.state.discogsAuthenticated){
      return (
        <Container component="main" maxWidth="s">
          <div className={classes.paper}>
            <Typography component="h1" variant="h4">
              Hello, {this.state.discogsUsername}
            </Typography>
          </div>
        </Container>
      )
    } else {
      return(
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Button variant="contained" color="secondary" onClick={this.onClickDiscogsLogin}>
              Connect Your Discogs
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
        </Container>
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
export default withStyles(useStyles, { withTheme: true })(Dashboard);
