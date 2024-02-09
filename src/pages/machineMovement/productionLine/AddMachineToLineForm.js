import React, { useEffect, useState } from "react";
import { Form } from "../../../components/Form/useForm";
import Controls from "../../../components/Controls/Controls";
import { useFormik } from "formik";
import * as yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import MuiDialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import {
  CircularProgress,
  Grid,
  withStyles,
  Tooltip,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  FormHelperText,
  MenuItem,
  Select as MuiSelect,
} from "@material-ui/core";

const style = makeStyles({
  wrapper: {
    position: "relative",
  },

  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
});

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

var initialValues = {
  id: 0,
  line: "",
  machine: "",
};

const AddMachineToLineForm = (props) => {
  const [lineNames, setLineNames] = useState([]);
  const [MachineList, setMachineList] = useState([]);
  const [Machines, setMachines] = useState([]);

  const unit = localStorage.getItem("unit");

  const { addOrEdit } = props;

  const validationSchema = yup.object().shape({
    line: yup.string().nullable().required("Line is required"),
    machine: yup.string().nullable().required("Machine is required"),
  });

  const classes = style();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(false);
      addOrEdit(values, resetForm, setSubmitting);
    },
  });

  // const lineFilter= ()=>{
  //   setLines(lineNames.filter(line => line.unit===formik.values.unit))
  // }

  const machineFilter = () => {
    setMachines(
      MachineList.map((obj) => {
        return {
          id: obj.id,
          name: obj.factory_serial_no,
        };
      })
    );
  };

  useEffect(() => {
    async function getLines() {
      const response = await fetch("/api/production/line/list/", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const body = await response.json();
      setLineNames(body);
    }
    getLines();
    async function getMachineNameList() {
      const response = await fetch("/api/ideal/machine/name/list/", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const body = await response.json();
      setMachineList(body);
    }
    getMachineNameList();
  }, []);

  useEffect(() => {
    // lineFilter();
    machineFilter();
  }, [formik.values.line]);

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Grid container alignItems="flex-start" spacing={2}>
        <Grid item md={12} sm={12} xs={12}>
          <Autocomplete
            id="line"
            options={lineNames}
            hide="true"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Line"
                variant="outlined"
                error={formik.touched.line && Boolean(formik.errors.line)}
                helperText={formik.touched.line && formik.errors.line}
              />
            )}
            getOptionLabel={(option) => option.name || ""}
            getOptionSelected={(option, value) => option.id === value.id}
            value={
              lineNames.find((line) => line.id === formik.values.line) ||
              formik.values.line ||
              null
            }
            onChange={(_event, line) => {
              formik.setFieldValue("line", line ? line.id : null);
            }}
            onBlur={formik.handleBlur}
            // multiple='true'
          />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          {/* <Autocomplete
                  id="machine"
                  options={Machines}
                  // disabled = {disableFabric}
                  hide = "true"
                  renderInput={params => (
                  <TextField {...params} label="Factory Serial No" variant="outlined" />
                  )}
                  getOptionLabel={option => option.name}
                  onChange={(_event, machine) => {
                  if(machine){
                      formik.setFieldValue("machine", machine.id)
                  }
                  }}
                  // multiple='true'
              /> */}

          <Autocomplete
            id="machine"
            options={Machines}
            hide="true"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Factory Serial No"
                variant="outlined"
                error={formik.touched.machine && Boolean(formik.errors.machine)}
                helperText={formik.touched.machine && formik.errors.machine}
              />
            )}
            getOptionLabel={(option) => option.name || ""}
            getOptionSelected={(option, value) => option.id === value.id}
            value={
              Machines.find(
                (machine) => machine.id === formik.values.machine
              ) ||
              formik.values.machine ||
              null
            }
            onChange={(_event, machine) => {
              formik.setFieldValue("machine", machine ? machine.id : null);
            }}
            onBlur={formik.handleBlur}
            // multiple='true'
          />
        </Grid>
      </Grid>

      <Grid item md={12} sm={12} xs={12}>
        <div className={classes.wrapper}>
          <Controls.Button type="submit" text="Add" style={{ width: "100%" }} />
        </div>
      </Grid>
    </Form>
  );
};

export default AddMachineToLineForm;
