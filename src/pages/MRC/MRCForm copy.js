import React from 'react';
import { useFormik } from 'formik';
import {   
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions, 
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DeleteIcon from '@material-ui/icons/Delete';

const MRCForm = ({ open, handleClose, initialValues, onSubmit }) => {

  const unitNames = ['DGL', 'Unit2', 'Unit3'];
  const machineTypeOptions = [
    {
      "id": 1,
      "name": "Kiabi"
    },
    {
      "id": 2,
      "name": "Jack & Jones"
    },
    {
      "id": 3,
      "name": "Tommy"
    },
    {
      "id": 4,
      "name": "Zara Man"
    },
];

  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  const handleAddSWM = () => {
    formik.setValues({
      ...formik.values,
      swm: [...formik.values.swm, { machine_type: '', machine_quantity: 0 }],
    });
  };

  const handleRemoveSWM = (index) => {
    const newSWM = [...formik.values.swm];
    newSWM.splice(index, 1);
    formik.setValues({ ...formik.values, swm: newSWM });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
    <DialogTitle>Production Form</DialogTitle>
    <DialogContent>
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField
            fullWidth
            id="style"
            name="style"
            label="Style"
            value={formik.values.style}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth>
            <InputLabel id="unit-name-label">Unit Name</InputLabel>
            <Select
              labelId="unit-name-label"
              id="unit_name"
              name="unit_name"
              value={formik.values.unit_name}
              onChange={formik.handleChange}
            >
              {unitNames.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            id="plant"
            name="plant"
            label="Plant"
            value={formik.values.plant}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            id="line"
            name="line"
            label="Line"
            value={formik.values.line}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            id="machine_type"
            name="machine_type"
            label="machine_type"
            value={formik.values.machine_type}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            id="start_date"
            name="start_date"
            label="Start Date"
            value={formik.values.start_date}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            id="end_date"
            name="end_date"
            label="End Date"
            value={formik.values.end_date}
            onChange={formik.handleChange}
          />
        </Grid>

        {/* SWM Section */}
        <Grid item xs={12}>
          <h3>SWM</h3>
          {formik.values.swm.map((swmEntry, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={4}>
                <FormControl fullWidth>
                <Autocomplete
                      options={machineTypeOptions}
                      getOptionLabel={(option) => option.name}
                      id={`swm[${index}].machine_type`}
                      name={`swm[${index}].machine_type`}
                      value={machineTypeOptions.find((option) => option.name === (swmEntry.machine_type || '')) || null}
                      onChange={(event, newValue) => {
                        const newValues = { ...initialValues };
                        newValues.swm[index].machine_type = newValue ? newValue.name : '';
                        onSubmit(newValues);
                      }}
                      renderInput={(params) => <TextField {...params} label="Machine Type" />}
                    />
                </FormControl>

                {/* <Autocomplete
                  id="machine_type"
                  options={machineTypeOptions}
                  hide = "true"
                  renderInput={params => (
                  <TextField {...params} label="machine_type" variant="outlined"
                    error={formik.touched.machine_type && Boolean(formik.errors.machine_type)}
                    helperText={formik.touched.machine_type && formik.errors.machine_type}
                  />
                  )}
                  getOptionLabel={option => option.name}
                  value={machineTypeOptions.find((type) => type.id === formik.values.machine_type) || formik.values.machine_type || null}
                  onChange={(_event, machine_type) => {
                    formik.setFieldValue("machine_type", machine_type ? machine_type.id : null);
                  }}
                  onBlur={formik.handleBlur}
                /> */}
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  id={`swm[${index}].machine_quantity`}
                  name={`swm[${index}].machine_quantity`}
                  label="Machine Quantity"
                  type="number"
                  value={formik.values.swm[index].machine_quantity}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={4}>
                <IconButton onClick={() => handleRemoveSWM(index)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button type="button" variant="contained" color="primary" onClick={handleAddSWM}>
            Add SWM
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
    </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MRCForm;
