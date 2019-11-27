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

import ConfirmationDialog from './ConfirmationDialog';

class ListenDialog extends React.Component {
  render() {
    if (!this.props.show) {
      return null;
    }

    return (
      <div>
        <ConfirmationDialog>
          <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Listen to <b>{this.props.title}</b> now?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={this.props.handleCancel} color="primary">
                Cancel
              </Button>
              <Button onClick={this.props.handleListen} color="primary">
                Listen
              </Button>
            </DialogActions>
        </ConfirmationDialog>
      </div>
    );
  }
}

export default ListenDialog;
