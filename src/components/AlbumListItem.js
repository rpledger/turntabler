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

var tileData = [
  {
    img: "https://img.discogs.com/SwnFq01J1XAXArAhfvgtG6EgkH0=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-986527-1293716829.jpeg.jpg",
    title: "Emotionalism",
    artist: "Avett Brothers"
  },
  {
    img: "https://img.discogs.com/7XGz7VuFH-dp80PqS_M-BLe7GGA=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-1963341-1262735484.jpeg.jpg",
    title: "I and Love and You",
    artist: "Avett Brothers"
  },
  {
    img: "https://img.discogs.com/7thNTBY7jzWL6Oa7QXwCssboU7k=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-2093811-1263645509.jpeg.jpg",
    title: "The Second Gleam",
    artist: "Avett Brothers"
  },
  {
    img: "https://img.discogs.com/7thNTBY7jzWL6Oa7QXwCssboU7k=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-2093811-1263645509.jpeg.jpg",
    title: "The Second Gleam",
    artist: "Avett Brothers"
  },
  {
    img: "https://img.discogs.com/7thNTBY7jzWL6Oa7QXwCssboU7k=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-2093811-1263645509.jpeg.jpg",
    title: "The Second Gleam",
    artist: "Avett Brothers"
  }
]

export default function AlbumListItem(props) {
  const classes = useStyles();
  const [openListenNowDialog, setOpenListenNowDialog] = React.useState(false);
  const [openPastDialog, setOpenPastDialog] = React.useState(false);
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

  const handleOpenPastDialog = () => {
    console.log("opening..")
    setOpenPastDialog(true);
  };

  const handleCancelPastDialog = () => {
    setOpenPastDialog(false);
  };

  const handleConfirmPastDialog = () => {
    setOpenPastDialog(false);
  };

  return (
    <div className={classes.root}>
          <ListItem>
            <ListItemAvatar>
              <Avatar variant="square" className={classes.bigAvatar} alt="Remy Sharp" src={props.img} />
            </ListItemAvatar>
            <ListItemText primary={props.title} secondary={props.artist}/>
            <ListItemIcon>
              <IconButton onClick={handleOpenListenNowDialog}>
                <PlayCircleOutlineIcon/>
              </IconButton>
            </ListItemIcon>
            <ListItemIcon>
              <IconButton onClick={handleOpenPastDialog}>
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
            title={props.title}
            id={props.id}
            open={openListenNowDialog}
            handleCancel={handleCancelListenNowDialog}
            handleListen={handleConfirmListenNowDialog}
          />
          <PastListenDialog
            title={props.title}
            id={props.id}
            open={openPastDialog}
            handleCancel={handleCancelPastDialog}
            handleListen={handleConfirmPastDialog}
          />
    </div>
  );
}
