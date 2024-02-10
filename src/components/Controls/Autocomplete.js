/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function Playground(props) {
    const { name, value, label, onChange, options, onBlur, fullWidth } = props;

  const optionsProps = {
    options: options.map((option) => option.name),
  };

  return (
    <Autocomplete fullWidth
      id="auto-complete"
      name={name}
      {...optionsProps}
      autoComplete
      includeInputInList
      onChange={onChange}
      value={value}
      onBlur={onBlur}
      
      renderInput={params => (
        <TextField
          margin="normal"
          label={label}
          name={name}
          {...params}
        />
      )}
  />
  );
}
