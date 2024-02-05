import React from "react";
import { Dialog, withStyles, Typography, IconButton, makeStyles } from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  dialogWrapper: {
    position: "absolute",
    top: theme.spacing(5),
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export default function FormDialog(props) {
  const { title, children, openPopup, setOpenPopup, maxWidth } = props;
  const classes = useStyles();

  const handleClose = () => {
    setOpenPopup(false);
  };

  return (
    <Dialog
      open={openPopup}
      fullWidth
      maxWidth={maxWidth}
      classes={{ paper: classes.dialogWrapper }}
    >
      <DialogTitle onClose={handleClose}>{title}</DialogTitle>
      {children}
    </Dialog>
  );
}
