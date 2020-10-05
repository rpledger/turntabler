import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AlbumIcon from '@material-ui/icons/Album';
import RadioIcon from '@material-ui/icons/Radio';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Link from '@material-ui/core/Link';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

function MenuAppBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [state, setState] = React.useState({
    openDrawer: false
  });
  const open = Boolean(anchorEl);

  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const toggleDrawer = (openDrawer) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, openDrawer: openDrawer });
  };

  function removeToken() {
    fetch('/token/remove', {
    method: 'post',
    body: JSON.stringify({})
  })


    localStorage.removeItem("token");
    window.location.reload(false);
  }


  function signInOrOut() {
  if (!cookies.get("csrf_access_token")) {
    return (<div>
      <ListItem button key="Sign In" href="/signIn">
        <ListItemIcon><ExitToAppIcon /></ListItemIcon>
        <ListItemText primary="Sign In" />
      </ListItem>
    </div>)
  }
  return (<div>
    <ListItem button key="Sign Out" onClick={removeToken}>
      <ListItemIcon><ExitToAppIcon /></ListItemIcon>
      <ListItemText primary="Sign Out" />
    </ListItem>
  </div>)
}

  const list = (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: false,
      })}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItemLink button key="Dashboard" href="/">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemLink>
        <ListItemLink button key="Albums" href="/albums">
          <ListItemIcon><AlbumIcon /></ListItemIcon>
          <ListItemText primary="Albums" />
        </ListItemLink>
        <ListItemLink button key="Plays" href="/plays">
          <ListItemIcon><RadioIcon /></ListItemIcon>
          <ListItemText primary="Plays" />
        </ListItemLink>
      </List>
      <Divider />
      <List>
        <ListItem button key="Profile">
          <ListItemIcon><AccountCircle /></ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button key="My Account">
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary="My Account" />
        </ListItem>
        {signInOrOut()}
      </List>
    </div>
  )

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>

          <Typography variant="h6" className={classes.title}>
            Turn Tabler
          </Typography>
            <div>
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={state["openDrawer"]} onClose={toggleDrawer(false)}>
                {list}
              </Drawer>
            </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default MenuAppBar;
