import React from 'react';
import MUIDataTable from "mui-datatables";

const columns = [
  {
   name: "img",
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
  name: "album",
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
  name: "last_listen_dtg",
  label: "Last Play",
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
 { img: "https://img.discogs.com/SwnFq01J1XAXArAhfvgtG6EgkH0=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-986527-1293716829.jpeg.jpg", album: "Emotionalism", artist: "Avett Brothers", last_listen_dtg: 1588035241000 },
 { img: "https://img.discogs.com/SwnFq01J1XAXArAhfvgtG6EgkH0=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-986527-1293716829.jpeg.jpg", album: "I and Love and You", artist: "Avett Brothers", last_listen_dtg: 1488035240000 },
 { img: "https://img.discogs.com/SwnFq01J1XAXArAhfvgtG6EgkH0=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-986527-1293716829.jpeg.jpg", album: "Revolver", artist: "The Beatles", last_listen_dtg: 1588035241000 }
];

const options = {
  print: false
};

class MUITableAlbums extends React.Component {
  render() {
    return (
      <MUIDataTable
        title={"Albums"}
        data={data}
        columns={columns}
        options={options}
      />
    )
  }
}
export default MUITableAlbums;
