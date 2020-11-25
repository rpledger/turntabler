// Dashboard.js
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { makeStyles, withStyles } from '@material-ui/core/styles';


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
    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
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

  render(){
    if (this.state.discogsAuthenticated){
      return <div><h4>Hello, {this.state.discogsUsername}</h4></div>
    } else {
      return(
        <div>
          <Button variant="contained" color="secondary">
            Discogs Login
          </Button>
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
export default withStyles(useStyles, { withTheme: true })(Dashboard);
