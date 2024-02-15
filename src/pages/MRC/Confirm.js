import {
    Box,
    Button,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
  } from "@mui/material";
  import React from "react";
  
  const Confirm = ({ open, onClose, actionText, onConfirm, value }) => {
    const handleConfirm = () => {
      onClose();
      if (value) {
        onConfirm(value);
        return value;
      }else{
        onConfirm();
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to {actionText} the item?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" style={{ backgroundColor: "#019301", color: "white" }}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" style={{ backgroundColor: "#e10707", color: "white" }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default Confirm;
