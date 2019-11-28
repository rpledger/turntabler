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
import PastListenDialog from './PastListenDialog';

class Album extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isListenDialogOpen: false,
      isPastDialogOpen: false
    }
  }

  toggleListenDialog = () => {
    this.setState({
      isListenDialogOpen: !this.state.isListenDialogOpen
    });
  }

  togglePastDialog = () => {
    this.setState({
      isPastDialogOpen: !this.state.isPastDialogOpen
    });
  }

  render() {
    return (
      <div>
      <ListItem>
        <ListItemAvatar>
          <Avatar variant="square" alt="Remy Sharp" src={this.props.img} />
        </ListItemAvatar>
        <ListItemText primary={this.props.title} secondary={this.props.artist}/>
        <ListItemIcon>
          <IconButton onClick={this.toggleListenDialog}>
            <PlayCircleOutlineIcon/>
          </IconButton>
        </ListItemIcon>
        <ListItemIcon>
          <IconButton onClick={this.togglePastDialog}>
            <CalendarTodayIcon/>
          </IconButton>
        </ListItemIcon>
        <ListItemIcon>
          <IconButton>
            <InfoIcon/>
          </IconButton>
        </ListItemIcon>
      </ListItem>
      <ListenNowDialog
        title={this.props.title}
        id={this.props.id}
        show={this.state.isListenDialogOpen}
        handleCancel={this.toggleListenDialog}
        handleListen={this.toggleListenDialog}
      />
      <PastListenDialog
        title={this.props.title}
        id={this.props.id}
        show={this.state.isPastDialogOpen}
        handleCancel={this.togglePastDialog}
        handleListen={this.togglePastDialog}
      />
      </div>
    );
  }
}
export default Album;
