import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Menu from '@material-ui/core/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import ListSubheader from '@material-ui/core/ListSubheader';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import InfoIcon from '@material-ui/icons/Info';

import ListenNowDialog from './ListenNowDialog';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  bigAvatar: {
    width: 50,
    height: 50,
  },
  paper: {
    marginRight: theme.spacing(2),
  },

}));

export default function AlbumListItemMenu(props) {
  const classes = useStyles();
  const [openListenNowDialog, setOpenListenNowDialog] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleOpenListenNowDialog = () => {
    setOpenListenNowDialog(true);
  };

  const handleCancelListenNowDialog = () => {
    setOpenListenNowDialog(false);
    setOpen(false);
  };

  const handleConfirmListenNowDialog = () => {
    setOpenListenNowDialog(false);
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <IconButton
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <MoreVertIcon/>
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        <ListSubheader onClick={handleClose}>{props.title}</ListSubheader>
        <Divider component="li" />
        <MenuItem onClick={handleOpenListenNowDialog}>
          <ListItemIcon>
            <PlayCircleOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Listen Now" />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <CalendarTodayIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Add Past Listen" />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="More Info" />
        </MenuItem>
      </Menu>
      <ListenNowDialog
        title={props.title}
        id={props.id}
        open={openListenNowDialog}
        handleCancel={handleCancelListenNowDialog}
        handleListen={handleConfirmListenNowDialog}
      />
    </div>
  );
}
