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

import AlbumListItem from './AlbumListItem';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  bigAvatar: {
    width: 50,
    height: 50,
  }

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

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

export default function SimpleList() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
      <ListItem>
        <ListItemText primary="A"/>
      </ListItem>
      <Divider component="li" />
      {tileData.map(tile => (
        <div>
          <AlbumListItem title={tile.title} artist={tile.artist} img={tile.img} />
        </div>
      ))}
      </List>
    </div>
  );
}
