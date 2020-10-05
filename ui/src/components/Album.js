import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
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

  listenDialog = () => {
    console.log(this.props)
    fetch('/api/listens/' + this.props.id, {
    method: 'post',
    body: JSON.stringify({})
  })
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
        id={this.props.key}
        show={this.state.isListenDialogOpen}
        handleCancel={this.toggleListenDialog}
        handleListen={this.listenDialog}
      />
      <PastListenDialog
        title={this.props.title}
        id={this.props.key}
        show={this.state.isPastDialogOpen}
        handleCancel={this.togglePastDialog}
        handleListen={this.togglePastDialog}
      />
      </div>
    );
  }
}
export default Album;
