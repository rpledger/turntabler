import React from 'react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import Album from './Album';

var tileData = {
  "1": {
    id: 1,
    img: "https://img.discogs.com/SwnFq01J1XAXArAhfvgtG6EgkH0=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-986527-1293716829.jpeg.jpg",
    title: "Emotionalism",
    artist: "Avett Brothers"
  },
  "2": {
    id: 2,
    img: "https://img.discogs.com/7XGz7VuFH-dp80PqS_M-BLe7GGA=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-1963341-1262735484.jpeg.jpg",
    title: "I and Love and You",
    artist: "Avett Brothers"
  },
  "3": {
    id: 3,
    img: "https://img.discogs.com/7thNTBY7jzWL6Oa7QXwCssboU7k=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-2093811-1263645509.jpeg.jpg",
    title: "The Second Gleam",
    artist: "Avett Brothers"
  }
}

class AlbumList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      albumList: {}
    };
  }

  componentDidMount() {
    fetch("http://localhost:4000/releases")
    .then(res => res.json())
    .then(
      (result) => {
        console.log("Loaded")
        this.setState({
          isLoaded: true,
          albumList: result
        })
      }
    )
  }

  render() {
    const { error, isLoaded, albumList } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return(
        <div>
          <List component="nav" aria-label="main mailbox folders">
          {
            Object.keys(tileData).map((key) => (
              <div>
                <Album
                  key={key}
                  title={tileData[key].title}
                  artist={tileData[key].artist}
                  img={tileData[key].img}
                />
                <Divider component="li" />
              </div>
            ))
          }
          </List>
        </div>
      )
    }
  }
}
export default AlbumList;
