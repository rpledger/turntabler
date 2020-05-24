import React from 'react';
import { Redirect } from 'react-router-dom';
import MUIDataTable from "mui-datatables";

const columns = [
  {
   name: "thumb",
   label: "Image",
   options: {
    filter: false,
    sort: false,
    customBodyRender: (value, tableMeta, updateValue) => (
      <img
        style={{ height: 36 }}
        src={value}
      />
    )
   }
  },
 {
  name: "title",
  label: "Album",
  options: {
   filter: true,
   sort: true,
  }
 },
 {
  name: "artist",
  label: "Artist",
  options: {
   filter: true,
   sort: true,
  }
 },
 {
  name: "dtg",
  label: "Play Date",
  options: {
   filter: false,
   sort: true,
   customBodyRender: (value, tableMeta, updateValue) => (
     new Date(value).toLocaleDateString()
   )
  }
 }
];

const data = [
 { img: "https://img.discogs.com/SwnFq01J1XAXArAhfvgtG6EgkH0=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-986527-1293716829.jpeg.jpg", album: "Emotionalism", artist: "Avett Brothers", dtg: 1588035241000 },
 { img: "https://img.discogs.com/SwnFq01J1XAXArAhfvgtG6EgkH0=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-986527-1293716829.jpeg.jpg", album: "I and Love and You", artist: "Avett Brothers", dtg: 1488035240000 },
 { img: "https://img.discogs.com/SwnFq01J1XAXArAhfvgtG6EgkH0=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-986527-1293716829.jpeg.jpg", album: "Revolver", artist: "The Beatles", dtg: 1588035241000 }
];

const options = {
  print: false
};

class MUITableListens extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      playList: {}
    };
  }

  componentDidMount() {
    fetch("/listens", {
      method: "get",
      headers: {
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    }})
    .then(res => res.json())
    .then(
      (result) => {
        console.log("Loaded")
        if (result["msg"]) {
          this.setState({error: result["msg"]})
        }
        this.setState({
          isLoaded: true,
          playList: result
        })
      }
    )
  }

  render() {
    const { error, isLoaded, playList } = this.state;
    if (error) {
      return <Redirect to="/signIn" />;
    } else if (!isLoaded) {
      return <div></div>;
    } else {
      return(
        <MUIDataTable
          title={"Album Plays"}
          data={playList}
          columns={columns}
          options={options}
        />
      )
    }
  }
}
export default MUITableListens;
