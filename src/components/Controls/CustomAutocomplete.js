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
        // multiple
        {...optionsProps}
        id="auto-complete"
        autoComplete
        includeInputInList
        width = "fit-content"
        renderInput={(params) => 
            <TextField 
            name={name} 
            label={label} 
            onchange={onChange} 
            value={value} 
            onBlur={onBlur} 
            margin="normal"
            style={{width: "100%"}}
            {...params}
            />
        }
      />
  );
}
