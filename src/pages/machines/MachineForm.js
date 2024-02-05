import React, { useState, useEffect } from "react";
import { useForm, Form } from "../../components/Form/useForm";
import Controls from "../../components/Controls/Controls";
import { useFormik } from "formik";
import * as yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import {
  InputLabel,
  Icon,
  Grid,
  Radio,
  RadioGroup,
  FormControl,
  MenuItem,
  TextField,
  CircularProgress,
  FormHelperText,
} from "@material-ui/core";
import { VerticalAlignCenter } from "@material-ui/icons";

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
  // name: "",
  model_no: "",
  parent_unit: "",
  category: "",
  type: "",
  brand: "",
  supplier: "",
  acquisition_value: "",
  acquisition_date: new Date(),
  warranty_start: new Date(),
  warranty_end: new Date(),
  warranty_details: "",
  factory_serial_no: "",
  manufacture_serial_no: "",
  location: "",
  air_consumption: "",
  steam_consumption: "",
  watt_consumption: "",
  start_date: new Date(),
  description: "",
  remark: "",
};


const MachineForm = (props) => {
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [units, setUnits] = useState([]);
  const [errorMessage, setErrorMessage ] = useState("")



  const { addOrEdit, recordForEdit, MachineList } = props;



  function duplicateModelNoCheck(list, value){
    var check = true
    if(list.length === 0){
      return check
    }else{
      for (let i=0; i< list.length; i ++){
        if(recordForEdit){
          if( recordForEdit.manufacture_serial_no === value){
            return true
          }else{
            if(value === list[i].manufacture_serial_no){       
              return check = false
            }
          }
        }else{
          if(value === list[i].manufacture_serial_no){       
            return check = false
          }
        }
      }
      return check;
    }
  }

  const validationSchema = yup.object().shape({
    model_no: yup.string().required("Model No is required"),
    parent_unit: yup.string().required("Parent Unit is required"),
    category: yup.string().required("Please select a category"),
    type: yup.string().required("Type is required"),
    brand: yup.string().required("Brand is required"),
    factory_serial_no: yup.string().required("Factory Serial No is required"),
    location: yup.string(),
    air_consumption: yup.string(),
    steam_consumption: yup.string(),
    watt_consumption: yup.string(),
    warranty_details: yup.string(),
    manufacture_serial_no: yup.string().required("Manufacture serial no is required")
        .test("Unique", "Manufacture serial no must be unique", (values) => {
      return duplicateModelNoCheck(MachineList, values)
    }),
    supplier: yup.string(),
    acquisition_value: yup.string(),
    description: yup.string(),
    remark: yup.string(),
  });

  

  const { values, setValues, handleChange } = useForm(initialFValues);

  const classes = style();  

  const formik = useFormik({
    initialValues: initialFValues,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
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

    async function getUnits() {
      const response = await fetch("/api/unit/name/list/", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
      });
      const body = await response.json();
      setUnits(body);
    }
    getUnits();

  }, []);


  // const generateUniqueName = ()=>{
  //   let model_no = formik.values.model_no
  //   let unit_id = formik.values.parent_unit
  //   var unique_name = "";

  //   if(model_no && unit_id){
  //     unique_name += model_no + "-" + unit_id
  //   }else if(model_no){
  //     unique_name += model_no
  //   }else{
  //     unique_name += unit_id
  //   }
  //   formik.values.name = unique_name
  //   return unique_name
  // }


  return (
    <Form onSubmit={formik.handleSubmit}>
      <Grid container alignItems="flex-start" spacing={1}>
      <Grid item md={3} sm={4} xs={6}>
          <Controls.Input
            label="Model No"
            name="model_no"
            value={formik.values.model_no}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.model_no && Boolean(formik.errors.model_no)}
            helperText={formik.touched.model_no && formik.errors.model_no}
            fullWidth
          />
        </Grid>
        <Grid item md={3} sm={4} xs={6}>
          <Controls.Select
            label="Unit"
            name="parent_unit"
            value={formik.values.parent_unit}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={units}
            error={formik.touched.parent_unit && Boolean(formik.errors.parent_unit)}
            helperText={formik.touched.parent_unit && formik.errors.parent_unit}
          />
        </Grid>
        {/* <Grid item md={3} sm={4} xs={6}>
          <Controls.Input
            label="Unique Name"
            name="name"
            value={generateUniqueName()}
            onChange={formik.handleChange}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
          />
        </Grid> */}
        <Grid item md={3} sm={4} xs={6}>
          <Controls.Select
            label="Category"
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={categories}
            error={formik.touched.category && Boolean(formik.errors.category)}
            helperText={formik.touched.category && formik.errors.category}
          />
        </Grid>
        <Grid item md={3} sm={4} xs={6}>
          <Controls.Select
            label="Type"
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={types}
            error={formik.touched.type && Boolean(formik.errors.type)}
            helperText={formik.touched.type && formik.errors.type}
          />
        </Grid>
        <Grid item md={4} sm={4} xs={6}>
          <Controls.Input
            label="Brand"
            name="brand"
            value={formik.values.brand}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.brand && Boolean(formik.errors.brand)}
            helperText={formik.touched.brand && formik.errors.brand}
            fullWidth
          />
        </Grid>
        <Grid item md={4} sm={4} xs={6}>
          <Controls.Input
            label="Supplier"
            name="supplier"
            value={formik.values.supplier}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.supplier && Boolean(formik.errors.supplier)}
            helperText={formik.touched.supplier && formik.errors.supplier}
            fullWidth
          />
        </Grid>
        <Grid item md={4} sm={4} xs={6}>
          <Controls.Input
            label="Acquisition Value"
            name="acquisition_value"
            value={formik.values.acquisition_value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type='number'
            error={formik.touched.acquisition_value && Boolean(formik.errors.acquisition_value)}
            helperText={formik.touched.acquisition_value && formik.errors.acquisition_value}
            fullWidth
          />
        </Grid>
        <Grid item md={4} sm={4} xs={6}>
          <Controls.DatePicker
              label="Acquisition Date"
              name="acquisition_date"
              value={formik.values.acquisition_date}
              onChange={value => {
                formik.setFieldValue("acquisition_date", value)
              }}
              onBlur={formik.handleBlur}
              fullWidth
            />
        </Grid>
        <Grid item md={4} sm={4} xs={6}>
          <Controls.DatePicker
              label="Warranty Start"
              name="warranty_start"
              value={formik.values.warranty_start}
              onChange={value => {
                formik.setFieldValue("warranty_start", value)
              }}
              onBlur={formik.handleBlur}
              fullWidth
            />
        </Grid>
        <Grid item md={4} sm={4} xs={6}>
          <Controls.DatePicker
              label="Warranty End"
              name="warranty_end"
              value={formik.values.warranty_end}
              onChange={value => {
                formik.setFieldValue("warranty_end", value)
              }}
              onBlur={formik.handleBlur}
              fullWidth
            />
        </Grid>
        <Grid item md={3} sm={4} xs={6}>
          <Controls.Input
            label="Warranty Details"
            name="warranty_details"
            value={formik.values.warranty_details}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.warranty_details && Boolean(formik.errors.warranty_details)}
            helperText={formik.touched.warranty_details && formik.errors.warranty_details}
            fullWidth
          />
        </Grid>
        <Grid item md={3} sm={4} xs={6}>
          <Controls.Input
            label="Factory Serial No"
            name="factory_serial_no"
            value={formik.values.factory_serial_no}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.factory_serial_no && Boolean(formik.errors.factory_serial_no)}
            helperText={formik.touched.factory_serial_no && formik.errors.factory_serial_no}
            fullWidth
          />
        </Grid>
        <Grid item md={3} sm={4} xs={6}>
          <Controls.Input
            label="Manufacture Serial No"
            name="manufacture_serial_no"
            value={formik.values.manufacture_serial_no}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.manufacture_serial_no && Boolean(formik.errors.manufacture_serial_no)}
            helperText={formik.touched.manufacture_serial_no && formik.errors.manufacture_serial_no}
            fullWidth
          />
        </Grid>
        <Grid item md={3} sm={4} xs={6}>
          <Controls.Input
            label="Location"
            name="location"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.location && Boolean(formik.errors.location)}
            helperText={formik.touched.location && formik.errors.location}
            fullWidth
          />
        </Grid>
        <Grid item md={3} sm={4} xs={6}>
          <Controls.Input
            label="Air Consumption"
            name="air_consumption"
            value={formik.values.air_consumption}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.air_consumption && Boolean(formik.errors.air_consumption)}
            helperText={formik.touched.air_consumption && formik.errors.air_consumption}
            fullWidth
          />
        </Grid>
        <Grid item md={3} sm={4} xs={6}>
          <Controls.Input
            label="Steam Consumption"
            name="steam_consumption"
            value={formik.values.steam_consumption}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.steam_consumption && Boolean(formik.errors.steam_consumption)}
            helperText={formik.touched.steam_consumption && formik.errors.steam_consumption}
            fullWidth
          />
        </Grid>
        <Grid item md={3} sm={4} xs={6}>
          <Controls.Input
            label="Watt Consumption"
            name="watt_consumption"
            value={formik.values.watt_consumption}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.watt_consumption && Boolean(formik.errors.watt_consumption)}
            helperText={formik.touched.watt_consumption && formik.errors.watt_consumption}
            fullWidth
          />
        </Grid>
        <Grid item md={3} sm={4} xs={6}>
          <Controls.DatePicker
              label="Start Date"
              name="start_date"
              value={formik.values.start_date}
              onChange={value => {
                formik.setFieldValue("start_date", value)
              }}
              onBlur={formik.handleBlur}
              fullWidth
            />
        </Grid>
        <Grid item md={6} sm={6} xs={12}>
          <Controls.Input
            label="Description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.description &&
              Boolean(formik.errors.description)
            }
            helperText={
              formik.touched.description && formik.errors.description
            }
            fullWidth
            multiline
            rows={2}
          />
        </Grid>
        <Grid item md={6} sm={6} xs={12}>
          <Controls.Input
            label="Remark"
            name="remark"
            value={formik.values.remark}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.remark && Boolean(formik.errors.remark)}
            helperText={formik.touched.remark && formik.errors.remark}
            fullWidth
            multiline
            rows={2}
          />
        </Grid>
        <Grid item style={{ marginTop: 10 }}>
          <div className={classes.wrapper}>
            <Controls.Button
              type="submit"
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

export default MachineForm;
