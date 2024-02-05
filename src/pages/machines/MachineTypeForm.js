import React, { useEffect, useState } from "react";
import { Form } from "../../components/Form/useForm";
import Controls from "../../components/Controls/Controls";
import { useFormik } from "formik";
import * as yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  CircularProgress,
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

var initialValues = {
  id: 0,
  name: "",
};

const duplicateNameCheck = (list, recordForEdit, value)=> {
  var check = true
  if(list.length === 0){
    return check
  }else{
    for (let i=0; i< list.length; i ++){
      if(recordForEdit){
        if( recordForEdit.name === value){
          return true
        }else{
          if(value === list[i].name){       
            return check = false
          }
        }
      }else{
        if(value === list[i].name){       
          return check = false
        }
      }
    }
    return check;
  }
};

const MachineTypeForm = (props) => {

  const { addOrEdit, recordForEdit, machineTypeList } = props;

  const validationSchema = yup.object().shape({
    name: yup.string()
    .required("Name is required")
    .test("Unique", "Name needs te be unique", (values) => {
      return duplicateNameCheck(machineTypeList, recordForEdit, values)
    }),
  });

  const classes = style();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      addOrEdit(values, resetForm, setSubmitting);
    },
  });

  useEffect(() => {
    if (recordForEdit != null)
      formik.setValues({
        ...recordForEdit,
      });
  }, [recordForEdit]);


  return (
    <Form onSubmit={formik.handleSubmit}>
      <Grid container alignItems="flex-start" spacing={2}>
        <Grid item md={12} sm={12} xs={12}>
          <Controls.Input
            label="Name"
            name="name"
            id="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            fullWidth
          />
        </Grid>
        <Grid item style={{ marginTop: 16 }}>
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

export {
  MachineTypeForm,
  duplicateNameCheck,
}