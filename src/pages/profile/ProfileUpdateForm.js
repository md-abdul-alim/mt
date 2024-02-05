import React, { useEffect, useState } from "react";
import { Form } from "../../components/Form/useForm";
import Controls from "../../components/Controls/Controls";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Notification from "../../components/SnackBar/Notification";
import {
  Paper,
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
  password: "",
  password2: "",
};

var passwordHold = "";
const ProfileUpdateForm = (props) => {
  var userId = localStorage.getItem('id');
  const [passwordMissMatchError, setPasswordMissMatchError] = useState("")
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const validationSchema = yup.object().shape({
    password: yup.string().required("Password is required")
    .test((values)=>{
      passwordHold = values
      return true
    }),
    password2: yup.string().required("Confirm Password is required")
    .test("Confirm", "Confirm password doesn't match!", (values) => {
      if(passwordHold === values){
        return true
      }
      return false
    }),
  });

  const classes = style();

  const updatePassword = async (values, setSubmitting) => {
    const requestOptions = {
      headers: {
        method: "PUT",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      },
    };

    try {
      await axios
        .put(`/api/change_password/${userId}/`, values, {
          requestOptions,
        })
        .then((resp) => {
          setSubmitting(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const addOrEdit = (password, resetForm, setSubmitting) => {
    if (password.id === 0) updatePassword(password, setSubmitting);
    resetForm();
    setNotify({
      isOpen: true,
      message: "Password changed",
      type: "success",
    });
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      addOrEdit(values, resetForm, setSubmitting)
    },
  });


  return (
    <div>
            <Form onSubmit={formik.handleSubmit}>
              <Grid  container style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 24 }}>
                <Paper elevation={3} square={false} style={{ padding: 24, paddingBottom: 24 }}>
                  <Grid container alignItems="center" spacing={2}>
                      <Grid item md={12} sm={12} xs={12}>
                        <Controls.Input
                            label="New Password"
                            name="password"
                            id="password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            fullWidth
                        />
                      </Grid>
                      <Grid item md={12} sm={12} xs={12}>
                        <Controls.Input
                            label="Confirm Password"
                            name="password2"
                            type="password"
                            value={formik.values.password2}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password2 && Boolean(formik.errors.password2)}
                            helperText={formik.touched.password2 && formik.errors.password2}
                            fullWidth
                        />
                      </Grid>
                      {/* <Grid item md={12} sm={12} xs={12} style={{color: 'red'}}>
                        <p style={{fontSize: "15px", margin: "0px"}}>{passwordMissMatchError.length > 0 ? passwordMissMatchError : null}</p>
                      </Grid> */}
                      <Grid item md={12} sm={12} xs={12}>
                        <div className={classes.wrapper}>
                            <Controls.Button
                            type="submit"
                            disabled={formik.isSubmitting}
                            text="Change Password"
                            />
                        </div>
                      </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Form>
          <Notification notify={notify} setNotify={setNotify} />
        </div>
  );
};

export default ProfileUpdateForm;
