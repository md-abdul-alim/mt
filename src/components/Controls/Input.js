import React from "react";
import { TextField } from "@material-ui/core";

export const Input = (props) => {
  const { name, value, label, onChange, error, helperText, ...other } = props;
  return (
      <TextField
        variant="outlined"
        label={label}
        onChange={onChange}
        name={name}
        value={value}
        error={error}
        helperText={helperText}
        {...other}
      />
  );
};
