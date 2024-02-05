import React, {useState, useEffect} from 'react'
import { Grid,Paper, Avatar, TextField, Button, Typography } from '@material-ui/core'
import { Link } from "react-router-dom";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { useFormik } from "formik";
import * as yup from "yup";
import { Form } from "../../components/Form/useForm";
import axios from "axios";
import Controls from "../../components/Controls/Controls";
import Notification from "../../components/SnackBar/Notification";


//context
import { useUserDispatch } from '../../context/UserContext';

var loginValues = {
    username: "",
    password: ""
  }

const validationSchema = yup.object({
  username: yup
    .string('Enter your email')
    .email('Enter a valid email address')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .required('Password is required'),
});

const Login=(props)=>{

    // global
    var dispatch = useUserDispatch();

    // local
    var [isLoading, setIsLoading] = useState(false);
    var [error, setError] = useState(null);
    const [notify, setNotify] = useState({
      isOpen: false,
      message: "",
      type: "",
    });

    const LoginFormik = useFormik({
        initialValues: loginValues,
        validationSchema: validationSchema,
        onSubmit: (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          login(values);
          resetForm();
        },
      });

      const login = async (values) => {
        setIsLoading(true);
        const requestOptions = {
          headers: {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          },
        };
    
        try {
          axios
          .post("/api/token/", values, requestOptions)
          .then((res) => {
            setTimeout(() => {
              localStorage.setItem('refresh_token', res.data.refresh)
              localStorage.setItem('access_token', res.data.access)
              localStorage.setItem('id', res.data.id)
              localStorage.setItem('first_name', res.data.first_name)
              localStorage.setItem('last_name', res.data.last_name)
              localStorage.setItem('user_type', res.data.user_type)
              localStorage.setItem('unit', res.data.unit)
              localStorage.setItem('unit_id', res.data.unit_id)
              setError(null)
              dispatch({ type: 'LOGIN_SUCCESS', payload: res.data })
              setIsLoading(false);
              props.history.push('/app/dashboard')
            }, 1000);
          })
          .catch((err) => {
            // dispatch({ type: "LOGIN_FAILURE" });
            setError(true);
            setIsLoading(false);
            setNotify({
              isOpen: true,
              message: "Please try again !!",
              type: "error",
            });
          });
        } catch (error) {
          console.log(error);
          setNotify({
            isOpen: true,
            message: "Please try again !!",
            type: "error",
          });
        }
      };

    const paperStyle={padding :20,height:'50%',width:380, margin:"20px auto"}
    const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'8px 0'}
    return(
        <Grid container style={{paddingTop: "100px"}}>
            <Paper elevation={10} style={paperStyle}>
              <Grid item align='center' md={12} sm={12} xs={12}>
                  <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar>
                  <h2>Sign In</h2>
              </Grid>
              <Grid item style={{paddingBottom: "150px"}} md={12} sm={12} xs={12}>
                <Form onSubmit={LoginFormik.handleSubmit}>
                    <Grid container justify="space-between" alignItems="flex-start" spacing={0}>
                        <Grid item md={12} sm={12} xs={12}>
                        <TextField 
                            label="Email"
                            placeholder='Enter Email'
                            name="username"
                            value={LoginFormik.values.username}
                            onChange={LoginFormik.handleChange}
                            onBlur={LoginFormik.handleBlur}
                            margin="normal"
                            type="email"
                            error={LoginFormik.touched.username && Boolean(LoginFormik.errors.username)}
                            helperText={LoginFormik.touched.username && LoginFormik.errors.username}
                            fullWidth
                            required
                        />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                        <TextField
                            label="Password"
                            placeholder='Enter password'
                            name="password"
                            id="password"
                            value={LoginFormik.values.password}
                            onChange={LoginFormik.handleChange}
                            onBlur={LoginFormik.handleBlur}
                            margin="normal"
                            type="password"
                            error={LoginFormik.touched.password && Boolean(LoginFormik.errors.password)}
                            helperText={LoginFormik.touched.password && LoginFormik.errors.password}
                            required
                            fullWidth
                        />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Controls.Button
                                type="submit"
                                disabled={ LoginFormik.isSubmitting || LoginFormik.values.username.length === 0 || LoginFormik.values.password.length === 0}
                                text="Login"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </Form>
                <Typography > Do you have an account ?
                      <Link
                          to={{
                            pathname: "/signup"
                          }}
                        >
                           Sign Up
                        </Link>
                </Typography>
              </Grid>
              <Grid item  align='center' md={12} sm={12} xs={12}>
                  <a href="https://www.dekkoisho.com/" className="mr-8" target="_blank">
                      <span style={{color: "purple"}}>&copy; 2023 Dekko Isho IT.</span>
                  </a>
              </Grid>
            </Paper>
            <Notification notify={notify} setNotify={setNotify} />
        </Grid>
    )
}

export default Login