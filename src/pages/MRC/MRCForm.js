import React, { useState, useEffect } from "react";
import { useForm, Form } from "../../components/Form/useForm";
import Controls from "../../components/Controls/Controls";
import { useFormik } from "formik";
import * as yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import {
  InputLabel,
  Icon,
  Button,
  Grid,
  Select,
  Radio,
  RadioGroup,
  FormControl,
  IconButton,
  MenuItem,
  TextField,
  CircularProgress,
  FormHelperText,
} from "@material-ui/core";
import { keys } from "@material-ui/core/styles/createBreakpoints";
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';


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

var initialFValues = {
  id: 0,
  style: "",
  unit: "",
  plant: "",
  buyer: "",
  swm: [
    {
      id: 0,
      line: "",
      start_date: new Date(),
      end_date: new Date(),
      swl: [
        {
          id: 0,
          machine_type: "",
          machine_quantity: 1
        }
      ]
    }
  ]
};


const MRCForm = (props) => {
  const [plants, setPlants] = useState([]);
  const [buyers, setbuyers] = useState([]);
  const [units, setUnits] = useState([]);

  const { addOrEdit, recordForEdit, MachineList } = props;

  const validationSchema = yup.object().shape({
    style: yup.string().required("Style is required"),
    unit: yup.string().required("Parent Unit is required"),
    plant: yup.string().required("Please select a plant"),
    buyer: yup.string().required("buyer is required"),
  });


  const classes = style();  

  const formik = useFormik({
    initialValues: initialFValues,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      console.log("values: ", values)
        setSubmitting(false);
        addOrEdit(values, resetForm, setSubmitting);
    },
  });

  useEffect(() => {
    if (recordForEdit != null)
      formik.setValues({
        ...recordForEdit,
      });
  }, [recordForEdit]);

  useEffect(() => {
    async function getplant() {
      const response = await fetch("/api/plant/list/", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-buyer": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
      },
    });
      const body = await response.json();
      setPlants(body);
    }
    getplant();

    async function getbuyers() {
      const response = await fetch("/api/buyer/list/", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-buyer": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
      });
      const body = await response.json();
      setbuyers(body);
    }
    getbuyers();

    async function getUnits() {
      const response = await fetch("/api/unit/name/list/", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-buyer": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
      });
      const body = await response.json();
      setUnits(body);
    }
    getUnits();

  }, []);

  const handleAddSWM1 = () => {
    formik.setValues({
      ...formik.values,
      swm: [...formik.values.swm, { line: '', start_date: new Date(), end_date: new Date() }],
    });
  };

  const handleAddSWM = (index) => {
    const joinData = formik.values.swm.concat({
      // fieldId: rowIndex + 1,
      line: "",
      start_date: new Date(),
      end_date: new Date()
    });
    formik.setFieldValue("swm", joinData)

  };

  const handleRemoveSWM = (index) => {
    const newSWM = [...formik.values.swm];
    newSWM.splice(index, 1);
    formik.setValues({ ...formik.values, swm: newSWM });
  };

  const addSWMOnChange = (e, i, fieldName) => {
    formik.setFieldValue(`swm[${i}].${fieldName}`, e?.value || e?.target?.value);
};


  return (
    <Form onSubmit={formik.handleSubmit}>
      <Grid container alignItems="flex-start" spacing={1}>
      <Grid item md={3} sm={4} xs={6}>
          <Controls.Input
            label="Style"
            name="style"
            value={formik.values.style}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.style && Boolean(formik.errors.style)}
            helperText={formik.touched.style && formik.errors.style}
            fullWidth
          />
        </Grid>
        <Grid item md={3} sm={4} xs={6}>
          <Controls.Select
            label="Unit"
            name="unit"
            value={formik.values.unit}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={units}
            error={formik.touched.unit && Boolean(formik.errors.unit)}
            helperText={formik.touched.unit && formik.errors.unit}
          />
        </Grid>
        <Grid item md={3} sm={4} xs={6}>
          <Controls.Select
            label="Plant"
            name="plant"
            value={formik.values.plant}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={plants}
            error={formik.touched.plant && Boolean(formik.errors.plant)}
            helperText={formik.touched.plant && formik.errors.plant}
          />
        </Grid>
        <Grid item md={3} sm={4} xs={6}>
          <Controls.Select
            label="Buyer"
            name="buyer"
            value={formik.values.buyer}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={buyers}
            error={formik.touched.buyer && Boolean(formik.errors.buyer)}
            helperText={formik.touched.buyer && formik.errors.buyer}
          />
        </Grid>
        <Grid item xs={12}>
          <h3>SWM</h3>
          {
            formik.values.swm.map((swmEntry, index) => (
              <Grid container spacing={1} key={index}>
                <Grid item xs={4}>
                  <Controls.Select
                    label="Line"
                    name="line"
                    onChange={(e)=>{
                      addSWMOnChange(e, e.rowIndex, "line")
                    }}
                    value={(e)=>{
                      return formik.values.swm[e.rowIndex]?.line
                    }}
                    onBlur={formik.handleBlur}
                    options={plants}
                    error={formik.touched.line && Boolean(formik.errors.line)}
                    helperText={formik.touched.line && formik.errors.line}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Controls.DatePicker
                    label="Start Date"
                    name="start_date"
                    onChange={(e) => addSWMOnChange(e, e.rowIndex, "start_date")}
                    value={(e)=>{
                      return formik.values.swm[e.rowIndex]?.start_date
                    }}
                    // onChange={value => {
                    //   formik.setFieldValue("start_date", value)
                    // }}
                    onBlur={formik.handleBlur}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <Controls.DatePicker
                    label="End Date"
                    name="end_date"
                    onChange={(e) => addSWMOnChange(e, e.rowIndex, "end_date")}
                    value={(e)=>{
                      return formik.values.swm[e.rowIndex]?.end_date
                    }}
                    onBlur={formik.handleBlur}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={1}>
                  <IconButton onClick={() => handleRemoveSWM(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>

                <Grid item xs={1}>
                  <IconButton onClick={() => handleAddSWM(index)}>
                    <AddIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))
          }
          {/* <Button node size="small" type="button" variant="outlined" color="secondary" onClick={handleAddSWM}>
            Add SWM
          </Button> */}
        </Grid>

        <Grid item style={{ marginTop: 10 }}>
          <div className={classes.wrapper}>
            <Controls.Button
              buyer="submit"
              disabled={formik.isSubmitting}
              text="Submit"
            />
            {formik.isSubmitting && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
            <Controls.Button
              text="Reset"
              color="default"
              onClick={formik.resetForm}
            />
          </div>
        </Grid>
      </Grid>
    </Form>
  );
};

export default MRCForm;
