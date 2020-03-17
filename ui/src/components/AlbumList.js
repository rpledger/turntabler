import React from 'react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import Album from './Album';


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
    fetch("/releases")
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
            Object.keys(albumList).map((key) => (
              <div>
                <Album
                  id={key}
                  key={key}
                  title={albumList[key].title}
                  artist={albumList[key].artist}
                  img={albumList[key].thumb}
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
