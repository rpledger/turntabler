import React from 'react';
import MaterialTable from 'material-table';

class AlbumTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isListenDialogOpen: false,
      isPastDialogOpen: false
    }
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
    return (
      <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        columns={[
          { title: "Adı", field: "name" },
          { title: "Soyadı", field: "surname" },
          { title: "Doğum Yılı", field: "birthYear", type: "numeric" },
          {
            title: "Doğum Yeri",
            field: "birthCity",
            lookup: { 34: "İstanbul", 63: "Şanlıurfa" }
          }
        ]}
        data={[
          { name: "Mehmet", surname: "Baran", birthYear: 1987, birthCity: 63 }
        ]}
        title="Demo Title"
      />
    </div>
    );
  }
}
export default AlbumTable;
