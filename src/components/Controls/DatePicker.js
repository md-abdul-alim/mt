import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function DatePicker(props) {

  const { name, value, label, onChange, error, helperText, ...other } = props;

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justifyContent="space-around">
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label={label}
          name={name}
          value={value}
          onChange={onChange}
          format="dd/MM/yyyy"
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          {...other}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}