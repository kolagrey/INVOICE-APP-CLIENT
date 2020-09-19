import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AlertDialog = ({
  updateAlertState,
  showDialog,
  title,
  body,
  okText,
  okAction,
  cancelText
}) => {
  // Close Alert Dialog
  const handleClose = () => {
    updateAlertState(false);
  };

  return (
    <Dialog
      open={showDialog}
      maxWidth={'xs'}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {body}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={okAction} color="secondary">
          {okText ? okText : 'Proceed'}
        </Button>
        <Button onClick={handleClose} color="default">
          {cancelText ? cancelText : 'Cancel'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AlertDialog.propTypes = {
  updateAlertState: PropTypes.func.isRequired,
  showDialog: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  okText: PropTypes.string,
  okAction: PropTypes.func,
  cancelText: PropTypes.string
};

export default AlertDialog;
