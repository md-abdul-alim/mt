import React, { useEffect, useState } from "react";
import { Form } from "../../components/Form/useForm";
import Controls from "../../components/Controls/Controls";
import { useFormik } from "formik";
import * as yup from "yup";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

import {
    Button,
    Paper,
    Grid,
    Table,
    TableBody,
    TableRow,
    TableCell,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    FormHelperText,
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
  fabric: "",
  issue_to: "",
  customer: "",
  quantity: "",
  unit_of_measure: "",
  purpose: ""
};


const AddMachineToLineForm = (props) => {

    const [MachineList, setMachineList] =useState([]);
    const {recordForEdit, addOrEdit } = props;
    //purpose start
    const [selected, setSelected] = useState([]);
    var tempPurpose = [];
    MachineList.map((option) => (
      tempPurpose.push(option.id)
    ))
    //purpose end


      
  const validationSchema = yup.object().shape({
    unit_of_measure: yup.string().required("UOM is required"),
    issue_to: yup.string().required("Issue to is required"),
    customer: yup.string().required("Customer is required"),
  });

  const classes = style();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      let data = new FormData();

        data.append('id', values.id);
        data.append('fabric', values.fabric);
        addOrEdit(data, resetForm, setSubmitting);
    },
  });

  useEffect(() => {
        async function getMachineList() {
            const response = await fetch("/api/machine/line/list/");
            const body = await response.json();
            setMachineList(body);
        }
        getMachineList();
    }, []);
  useEffect(() => {
    if (recordForEdit != null){
      formik.setValues({
        ...recordForEdit,
      });
    }
        
  }, [recordForEdit]);


  return(
    <div>
        <Form onSubmit={formik.handleSubmit}>
            <Grid justify="space-between" container spacing={5} style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 24 }}>
                <Grid item md={12}>
                    <Paper elevation={3} square={false} style={{ padding: 24, paddingBottom: 24 }}>
                        <Grid container justify="space-between" alignItems="flex-start" spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Controls.MultipleSelect
                                    options={MachineList}
                                    isAllSelected = { MachineList.length > 0 && selected.length === MachineList.length}
                                    onChange = {(event) => {
                                        const value = event.target.value;
                                        if (value[value.length - 1] === "all") {
                                          setSelected(selected.length === MachineList.length ? [] : tempPurpose);
                                          return;
                                        }
                                        setSelected(value);
                                      }
                                    }
                                    selected = {selected}
                                />
                            </Grid>
                            <Grid item style={{ marginTop: 3 }} md={6} sm={6} xs={6}>
                                <div className={classes.wrapper}>
                                    <Controls.Button
                                        type="submit"
                                        disabled={formik.isSubmitting}
                                        text="Submit"
                                    />                                  
                                    <Controls.Button
                                        text="Reset"
                                        color="default"
                                        onClick = {(e)=>{
                                            formik.resetForm(e)
                                        }}
                                    />
                                </div> 
                            </Grid>
                        </Grid>                          
                    </Paper>
                </Grid>        
            </Grid>
        </Form>
    </div>
)
};

export default AddMachineToLineForm;
