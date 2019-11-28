import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import PastListenPicker from './PastListenPicker';

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

export default function PastListenDialog(props) {
  const classes = useStyles();

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
