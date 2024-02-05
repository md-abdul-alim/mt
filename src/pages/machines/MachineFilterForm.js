import React, { useState, useEffect } from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  useForm, 
  Form 
} from "../../components/Form/useForm";
import Controls from "../../components/Controls/Controls";
// import Divider from "@material-ui/core/Divider";
// import Typography from "@material-ui/core/Typography";
// import Autocomplete from '@material-ui/lab/Autocomplete';
// import Select from "@material-ui/core/Select";
import { useFormik } from "formik";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

// import * as yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import {
  // InputLabel,
  // Icon,
  Grid,
  // Radio,
  // RadioGroup,
  // FormControl,
  // MenuItem,
  // TextField,
  CircularProgress,
  // FormHelperText,
} from "@material-ui/core";
// import { VerticalAlignCenter } from "@material-ui/icons";

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

var today = new Date()
var fromDate = new Date()
fromDate.setMonth(fromDate.getMonth() - 1)

var initialFValues = {
  id: 0,
  unit: "",
  category: "",
  type: "",
  status: "",
};


const MachineFilterForm = (props) => {
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [units, setUnits] = useState([]);
  const [status, setStatus] = useState([]);

  const { addOrEdit, recordForEdit } = props;
  const { values, setValues, handleChange } = useForm(initialFValues);
  const classes = style();


  const formik = useFormik({
    initialValues: initialFValues,
    // validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      addOrEdit(values, resetForm, setSubmitting);
    },
  });

  const AxiosHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    },
  }

  useEffect(() => {
    if (recordForEdit != null)
      formik.setValues({
        ...recordForEdit,
      });
  }, [recordForEdit]);

  useEffect(() => {
    async function getUnitName() {
      const response = await fetch("/api/unit/list/", AxiosHeader);
      const body = await response.json();
      setUnits(body);
    }
    getUnitName();

    async function getStatus() {
      const response = await fetch("/api/machine/status/list/", AxiosHeader);
      const body = await response.json();
      setStatus(body);
    }
    getStatus();

    async function getCategory() {
      const response = await fetch("/api/machine/category/list/", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
      },
    });
      const body = await response.json();
      setCategories(body);
    }
    getCategory();

    async function getTypes() {
      const response = await fetch("/api/machine/type/list/", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
      });
      const body = await response.json();
      setTypes(body);
    }
    getTypes();
  }, []);

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Grid container alignItems="flex-start" spacing={2}>
        <Grid item md={3} sm={4} xs={6}>
          <Controls.Autocomplete
            label="Unit"
            name="unit"
            
            onChange={(e, value) => {
              formik.setFieldValue(
                "unit",
                value !== null ? value : initialFValues.unit
              );
            }}
            value={formik.values.unit}
            onBlur={formik.handleBlur}
            options={units}
          />
        </Grid>
        <Grid item md={3} sm={4} xs={6}>
          <Controls.Autocomplete
            label="Category"
            name="category"
            
            onChange={(e, value) => {
              formik.setFieldValue(
                "category",
                value !== null ? value : initialFValues.category
              );
            }}
            value={formik.values.category}
            onBlur={formik.handleBlur}
            options={categories}
          />
        </Grid>
        <Grid item md={3} sm={4} xs={6}>
          <Controls.Autocomplete
            label="Type"
            name="type"
            
            onChange={(e, value) => {
              formik.setFieldValue(
                "type",
                value !== null ? value : initialFValues.type
              );
            }}
            value={formik.values.type}
            onBlur={formik.handleBlur}
            options={types}
          />
        </Grid>
        <Grid item md={2} sm={4} xs={6}>
          <Controls.Autocomplete
            label="Status"
            name="status"
            
            onChange={(e, value) => {
              formik.setFieldValue(
                "status",
                value !== null ? value : initialFValues.status
              );
            }}
            value={formik.values.status}
            onBlur={formik.handleBlur}
            options={status}
          />
        </Grid>
        <Grid item style={{ marginTop: 16 }} md={1} sm={4} xs={6}>
          <div className={classes.wrapper}>
            <Controls.Button
              type="submit"
              disabled={formik.isSubmitting}
              text="Search"
            />
            {formik.isSubmitting && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </Grid>
      </Grid>
    </Form>
  );
};

export default MachineFilterForm;
