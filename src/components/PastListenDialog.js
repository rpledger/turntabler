import React from 'react';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

import PastListenPicker from './PastListenPicker';

export default function PastListenDialog(props) {

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
          Add past listen for <b>{props.title}</b> at:
        </DialogContentText>
        <PastListenPicker />
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
