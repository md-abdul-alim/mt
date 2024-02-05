import React, { useEffect, useState } from "react";
import { Form } from "../../../components/Form/useForm";
import Controls from "../../../components/Controls/Controls";
import { useFormik } from "formik";
import * as yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import MuiDialogActions from "@material-ui/core/DialogActions";
import axios from "axios";
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
  Select as MuiSelect
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
};


const AddMachineToLineByBarcodeForm = (props) => {
  const [lines, setLines] = useState([]);
  const [Machines, setMachines] =useState([]);

  const { addOrEdit, ideal, searchValue } = props;


  const validationSchema = yup.object().shape({
    line: yup.string().required("Line is required"),
  });

  const classes = style();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(false);
      const modifiedData = {
        ...values,
        id: Machines?.id || 0,
    };
      addOrEdit(modifiedData, resetForm, setSubmitting);
    },
  });

  const idealFunction = () => {
    ideal(Machines);
  };

  async function getMachineInfo() {
    const AxiosHeader = {
      headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
    };

    try {
      await axios
        .get("/api/get/machine/", { params:  {code: searchValue}  }, AxiosHeader )
        .then((res) => {
          setMachines(res.data);
          // formik.values.unit = Machines.current_unit_name;
          // formik.values.machine = Machines.id;
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  // const lineFilter= ()=>{
  //   setLines(lineNames.filter(line => line.unit===Machines.current_unit_id))
  // }


  useEffect(() => {
    async function getLines() {
        const response = await fetch("/api/production/line/list/",{
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
          },
        });
        const body = await response.json();
        setLines(body);
    }
    getLines();
  }, []);

  useEffect(() => {
    // lineFilter();
    getMachineInfo();
  }, [ Machines.current_unit_id, searchValue]);

  return (
    <Form onSubmit={formik.handleSubmit}>
        <Grid container alignItems="flex-start" spacing={2}>
        <Grid item md={12} sm={12} xs={12} style={{textAlign: "center"}}>
          <p>Parent Unit: {Machines.parent_unit_name}</p>
          <p>Current Unit: {Machines.current_unit_name}</p>
          <p>Factory Serial No: {Machines.factory_serial_no}</p>
          <p>Current Line: {Machines.current_line}</p>
        </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <Controls.Select
              label="Line"
              name="line"
              value={formik.values.line}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              options={lines}
              error={formik.touched.line && Boolean(formik.errors.line)}
              helperText={formik.touched.line && formik.errors.line}
            />
          </Grid>

        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <div className={classes.wrapper}>
            <Controls.Button
              type="submit"
              disabled={formik.isSubmitting}
              style={{'width': '100%'}}
              text="Update Line"
            />
            <Controls.Button
              text="Ideal"
              disabled={Machines.current_line === 'No Line' ? true : false}
              style={{'width': '100%', 'background': 'red'}}
              onClick={idealFunction}
            />
          </div>
        </Grid> 
    </Form>
  );
};

export default AddMachineToLineByBarcodeForm;
