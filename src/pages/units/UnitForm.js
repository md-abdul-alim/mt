import React, { useEffect } from "react";
import { Form } from "../../components/Form/useForm";
import Controls from "../../components/Controls/Controls";
import { useFormik } from "formik";
// import * as yup from "yup";
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
  company: "",
  department: "",
  name: "",
};


const UnitForm = (props) => {

  const { addOrEdit, recordForEdit } = props;

  // const validationSchema = yup.object().shape({
  //   name: yup.string()
  //   .required("Name is required"),
  // });

  const classes = style();

  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: validationSchema,
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
            label="Company"
            name="company"
            id="company"
            value={formik.values.company}
            onChange={formik.handleChange}
            error={formik.touched.company && Boolean(formik.errors.company)}
            helperText={formik.touched.company && formik.errors.company}
            fullWidth
          />
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <Controls.Input
            label="Department"
            name="department"
            id="department"
            value={formik.values.department}
            onChange={formik.handleChange}
            error={formik.touched.department && Boolean(formik.errors.department)}
            helperText={formik.touched.department && formik.errors.department}
            fullWidth
          />
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <Controls.Input
            label="Unit Name"
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

export default UnitForm;