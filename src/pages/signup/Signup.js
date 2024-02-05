import React, {useState, useEffect} from 'react'
import { Grid,Paper, Avatar, TextField, Typography, 
  FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText } from '@material-ui/core'
import { Link } from "react-router-dom";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import Notification from "../../components/SnackBar/Notification";
import { useFormik } from "formik";
import * as yup from "yup";
import { Form } from "../../components/Form/useForm";
import axios from "axios";
import Controls from "../../components/Controls/Controls";


//context
// import { useUserDispatch } from '../../context/UserContext';


const validationSchema = yup.object({
  first_name: yup
    .string('Enter your first name')
    .required('First name is required'),
  last_name: yup
    .string('Enter your last name')
    .required('Last name is required'),
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password2: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  password: yup
    .string('Enter your password')
    .oneOf([yup.ref('password2'), null], 'Passwords must match')
});


var signValues = {
    first_name: "",
    last_name: "",
    email: "",
    unit: "",
    designation: "",
    password: "",
    password2: ""
  }
const Signup=(props)=>{

    // global
    // var dispatch = useUserDispatch();

    const [notify, setNotify] = useState({
      isOpen: false,
      message: "",
      type: "",
    });

    // local
    const [groups, setGroups] = useState([])
    var [isLoading, setIsLoading] = useState(false);
    var [error, setError] = useState(null);
    const [units, setUnits] = useState([]);

    const SignupFormik = useFormik({
        initialValues: signValues,
        validationSchema: validationSchema,
        onSubmit: (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          signup(values);
          resetForm();
        },
      });

      const signup = async (values) => {
        setIsLoading(true);
        const requestOptions = {
          headers: {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          },
        };
    
        try {
          axios
          .post("/api/register/", values, requestOptions)
          .then((res) => {
            setTimeout(() => {
              setError(null)
              // dispatch({ type: 'SIGNUP_SUCCESS', payload: res.data })
              setIsLoading(false);
              props.history.push('/login')
            }, 1000);

          })
          .catch((err) => {
            // dispatch({ type: "LOGIN_FAILURE" });
            
            setError(true);
            setIsLoading(false);
            setNotify({
              isOpen: true,
              message: err.response.data.email ? "This email is already registered." : "Please try another",
              type: "error",
            });
          });
        } catch (error) {
          console.log(error);
        }
      };

      useEffect(() => {
        async function getGroups() {
          const response = await fetch("/api/group/list/");
          const body = await response.json();
          setGroups(body);
        }
        getGroups()

        async function getUnits() {
          const response = await fetch("/api/unit/name/list/", {headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${localStorage.getItem("access_token")}`
          },});
          const body = await response.json();
          setUnits(body);
        }
        getUnits();
    
      }, []);

    const paperStyle={padding :20,height:'50%',width:380, margin:"20px auto"}
    const avatarStyle={backgroundColor:'#1bbd7e'}
    // const btnstyle={margin:'8px 0'}
    return(
        <Grid container style={{paddingTop: "100px"}}>
            <Paper elevation={10} style={paperStyle}>
              <Grid item align='center' md={12} sm={12} xs={12}>
                  <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar>
                  <h2>Sign Up View</h2>
              </Grid>
              <Grid item style={{paddingBottom: "150px"}} md={12} sm={12} xs={12}>
                <Form onSubmit={SignupFormik.handleSubmit}>
                    <Grid container justify="space-between" alignItems="flex-start" spacing={0}>
                    <Grid item md={12} sm={12} xs={12}>
                        <TextField 
                            label="First Name"
                            placeholder='Enter First Name'
                            name="first_name"
                            value={SignupFormik.values.first_name}
                            onChange={SignupFormik.handleChange}
                            onBlur={SignupFormik.handleBlur}
                            margin="normal"
                            type="text"
                            error={SignupFormik.touched.first_name && Boolean(SignupFormik.errors.first_name)}
                            helperText={SignupFormik.touched.first_name && SignupFormik.errors.first_name}
                            fullWidth
                            required
                        />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                        <TextField 
                            label="Last Name"
                            placeholder='Enter Last Name'
                            name="last_name"
                            value={SignupFormik.values.last_name}
                            onChange={SignupFormik.handleChange}
                            onBlur={SignupFormik.handleBlur}
                            margin="normal"
                            type="text"
                            error={SignupFormik.touched.last_name && Boolean(SignupFormik.errors.last_name)}
                            helperText={SignupFormik.touched.last_name && SignupFormik.errors.last_name}
                            fullWidth
                            required
                        />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <TextField 
                              label="Email"
                              placeholder='Enter Email'
                              name="email"
                              value={SignupFormik.values.email}
                              onChange={SignupFormik.handleChange}
                              onBlur={SignupFormik.handleBlur}
                              margin="normal"
                              type="email"
                              error={SignupFormik.touched.email && Boolean(SignupFormik.errors.email)}
                              helperText={SignupFormik.touched.email && SignupFormik.errors.email}
                              fullWidth
                              required
                          />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <FormControl fullWidth
                            {...(error && {error:true})}>
                                <InputLabel>Unit</InputLabel>
                                <MuiSelect
                                    label="Unit"
                                    name="unit"
                                    value={SignupFormik.values.unit}
                                    onChange={SignupFormik.handleChange}
                                    onBlur={SignupFormik.handleBlur}
                                    >
                                    <MenuItem value="">None</MenuItem>
                                    {
                                        units.map(
                                            item => (<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                                        )
                                    }
                                </MuiSelect>
                            </FormControl>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <FormControl fullWidth
                            {...(error && {error:true})}>
                                <InputLabel>Designation</InputLabel>
                                <MuiSelect
                                    label="Designation"
                                    name="designation"
                                    value={SignupFormik.values.designation}
                                    onChange={SignupFormik.handleChange}
                                    onBlur={SignupFormik.handleBlur}
                                    >
                                    <MenuItem value="">None</MenuItem>
                                    {
                                        groups.map(
                                            item => (<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                                        )
                                    }
                                </MuiSelect>
                            </FormControl>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                        <TextField
                            label="Password"
                            placeholder='Enter password'
                            name="password2"
                            id="password2"
                            value={SignupFormik.values.password2}
                            onChange={SignupFormik.handleChange}
                            onBlur={SignupFormik.handleBlur}
                            error={SignupFormik.touched.password2 && Boolean(SignupFormik.errors.password2)}
                            helperText={SignupFormik.touched.password2 && SignupFormik.errors.password2}
                            margin="normal"
                            type="password"
                            required
                            fullWidth
                        />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                        <TextField
                            label="Retype Password"
                            placeholder='Retype password '
                            name="password"
                            id="password"
                            value={SignupFormik.values.password}
                            onChange={SignupFormik.handleChange}
                            onBlur={SignupFormik.handleBlur}
                            margin="normal"
                            type="password"
                            error={SignupFormik.touched.password && Boolean(SignupFormik.errors.password)}
                            helperText={SignupFormik.touched.password && SignupFormik.errors.password}
                            required
                            fullWidth
                        />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <Controls.Button
                                type="submit"
                                disabled={
                                    SignupFormik.isSubmitting,
                                    SignupFormik.values.email.length === 0 || SignupFormik.values.password.length === 0
                                }
                                text="Sign Up"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </Form>
                <Typography > Do you have an account ?
                      <Link
                          to={{
                            pathname: "/login"
                          }}
                        >
                           Login
                      </Link>
                </Typography>
              </Grid>
              <Grid item  align='center' md={12} sm={12} xs={12}>
                  <a href="https://www.dekkoisho.com/" className="mr-8" target="_blank">
                      <span style={{color: "purple"}}>&copy; 2022 Dekko Isho IT.</span>
                  </a>
              </Grid>
            </Paper>
            <Notification notify={notify} setNotify={setNotify} />
        </Grid>
    )
}

export default Signup