import React from 'react';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';


export default function ListenNowDialog(props) {

  return (
    <div>
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={props.show}
    >
    <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Listen to <b>{props.title}</b> now?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={props.handleListen} color="primary">
          Listen
        </Button>
      </DialogActions>
    </Dialog>
    </div>
  );
}
