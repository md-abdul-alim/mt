import React from 'react'
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText } from '@material-ui/core';

export default function Select(props) {

    const { name, label, value, error, onChange, options, helperText, onBlur, disabled } = props;

    return (
        <FormControl variant="outlined" fullWidth
        {...(error && {error:true})}>
            <InputLabel>{label}</InputLabel>
            <MuiSelect
                label={label}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                onBlur = {onBlur}>
                <MenuItem value="">None</MenuItem>
                {
                    options.map(
                        item => (<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                    )
                }
            </MuiSelect>
            {error && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    )
}