import React, { useEffect, useState } from "react";
import { Form } from "../../components/Form/useForm";
import Controls from "../../components/Controls/Controls";
import { useFormik } from "formik";
import * as yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import MuiDialogActions from "@material-ui/core/DialogActions";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

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
  to_unit: "",
  type: "",
  machine: "",
  manual_chalan_no: "",
  // chalan_date: new Date(),
  carrier_name: "",
  carrier_designation: "",
  carrier_transport: "",
  carrier_mobile_no: "",
  receiver_name: "",
  receiver_address: "",
  receiver_mobile_no: "",
  return_date: new Date(),
  purpose: "",
  remark: ""
};


const MRCDetails = (props) => {
  const [units, setUnits] = useState([]);
  const [transfer, getTransfer] = useState([]);
  const [MachineList, setMachineList] =useState([]);
  const [Machines, setMachines] =useState([]);

  const unit = localStorage.getItem("unit")
  const user_type = localStorage.getItem("user_type")
  // console.log("Machines: ", units)

  const { recordForEdit } = props;

  const validationSchema = yup.object().shape({
    line: yup.string().required("Line is required"),
    machine: yup.string().required("Machine is required"),
  });

  const classes = style();

  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(false);
      // addOrEdit(values, resetForm, setSubmitting);
    },
  });

  const machineFilter= ()=>{
    setMachines(MachineList.map(obj => {
      return {
        id: obj.id,
        name: obj.factory_serial_no
      }
    }))
  }

  useEffect(() => {

    async function getTransferTypes() {
      const response = await fetch("/api/machine/transfer/type/list/", {headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
      },});
      const body = await response.json();
      getTransfer(body);
  }
  getTransferTypes();

    async function getUnits() {
        const response = await fetch("/api/unit/name/list/", {headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },});
        const body = await response.json();
        setUnits(body);
    }
    getUnits();
    async function getMachineNameList() {
        const response = await fetch("/api/ideal/machine/name/list/", {headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },});
        const body = await response.json();
        setMachineList(body);
    }
    getMachineNameList();
    
}, []);


  useEffect(() => {
    if (recordForEdit !== null)
      formik.setValues({
        ...recordForEdit,
      });
  }, [recordForEdit]);

  return (
    <Form onSubmit={formik.handleSubmit}>
        <Grid container alignItems="flex-start" spacing={1}>

            <Grid item md={4} sm={4} xs={12}>
              <Controls.Select
                label="Transfer To (Unit)"
                name="to_unit"
                value={formik.values.to_unit}
                disabled = {true}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={units}
                error={formik.touched.to_unit && Boolean(formik.errors.to_unit)}
                helperText={formik.touched.to_unit && formik.errors.to_unit}
              />
            </Grid>
            <Grid item md={3} sm={3} xs={12}>
              <Controls.Select
                label="Type"
                name="type"
                value={formik.values.type}
                disabled = {true}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={transfer}
                error={formik.touched.type && Boolean(formik.errors.type)}
                helperText={formik.touched.type && formik.errors.type}
              />
            </Grid>
            <Grid item md={2} sm={2} xs={12}>
              <Controls.DatePicker
                  label="Return Date"
                  name="return_date"
                  value={formik.values.return_date}
                  onChange={value => {
                    formik.setFieldValue("return_date", value)
                  }}
                  onBlur={formik.handleBlur}
                  disabled = {true}
                  fullWidth
                />
            </Grid>
            <Grid item md={3} sm={3} xs={12}>
              <Controls.Input
                label="Chalan No (Book)"
                name="manual_chalan_no"
                value={formik.values.manual_chalan_no}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled = {true}
                error={formik.touched.manual_chalan_no && Boolean(formik.errors.manual_chalan_no)}
                helperText={formik.touched.manual_chalan_no && formik.errors.manual_chalan_no}
                fullWidth
              />
            </Grid>
            <Grid item md={4} sm={4} xs={12}>
              <Controls.Input
                label="Carrier Name"
                name="carrier_name"
                value={formik.values.carrier_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled = {true}
                error={formik.touched.carrier_name && Boolean(formik.errors.carrier_name)}
                helperText={formik.touched.carrier_name && formik.errors.carrier_name}
                fullWidth
              />
            </Grid>
            <Grid item md={4} sm={4} xs={12}>
              <Controls.Input
                label="Carrier Designation"
                name="carrier_designation"
                value={formik.values.carrier_designation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled = {true}
                error={formik.touched.carrier_designation && Boolean(formik.errors.carrier_designation)}
                helperText={formik.touched.carrier_designation && formik.errors.carrier_designation}
                fullWidth
              />
            </Grid>
            <Grid item md={4} sm={4} xs={12}>
              <Controls.Input
                label="Carrier Transport"
                name="carrier_transport"
                value={formik.values.carrier_transport}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled = {true}
                error={formik.touched.carrier_transport && Boolean(formik.errors.carrier_transport)}
                helperText={formik.touched.carrier_transport && formik.errors.carrier_transport}
                fullWidth
              />
            </Grid>
            <Grid item md={4} sm={4} xs={12}>
              <Controls.Input
                label="Carrier Mobile No"
                name="carrier_mobile_no"
                value={formik.values.carrier_mobile_no}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled = {true}
                error={formik.touched.carrier_mobile_no && Boolean(formik.errors.carrier_mobile_no)}
                helperText={formik.touched.carrier_mobile_no && formik.errors.carrier_mobile_no}
                fullWidth
              />
            </Grid>
            <Grid item md={4} sm={4} xs={12}>
              <Controls.Input
                label="Receiver Name"
                name="receiver_name"
                value={formik.values.receiver_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled = {true}
                error={formik.touched.receiver_name && Boolean(formik.errors.receiver_name)}
                helperText={formik.touched.receiver_name && formik.errors.receiver_name}
                fullWidth
              />
            </Grid>
            <Grid item md={4} sm={4} xs={12}>
              <Controls.Input
                label="Receiver Address"
                name="receiver_address"
                value={formik.values.receiver_address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled = {true}
                error={formik.touched.receiver_address && Boolean(formik.errors.receiver_address)}
                helperText={formik.touched.receiver_address && formik.errors.receiver_address}
                fullWidth
              />
            </Grid>
            <Grid item md={4} sm={4} xs={12}>
              <Controls.Input
                label="Receiver Mobile No"
                name="receiver_mobile_no"
                value={formik.values.receiver_mobile_no}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled = {true}
                error={formik.touched.receiver_mobile_no && Boolean(formik.errors.receiver_mobile_no)}
                helperText={formik.touched.receiver_mobile_no && formik.errors.receiver_mobile_no}
                fullWidth
              />
            </Grid>
            <Grid item md={4} sm={4} xs={12}>
              <Controls.Input
                label="Purpose"
                name="purpose"
                value={formik.values.purpose}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled = {true}
                error={formik.touched.purpose && Boolean(formik.errors.purpose)}
                helperText={formik.touched.purpose && formik.errors.purpose}
                fullWidth
              />
            </Grid>
            <Grid item md={4} sm={4} xs={12}>
              <Controls.Input
                label="Remark"
                name="remark"
                id="remark"
                value={formik.values.remark}
                onChange={formik.handleChange}
                disabled = {true}
                error={formik.touched.remark && Boolean(formik.errors.remark)}
                helperText={formik.touched.remark && formik.errors.remark}
                fullWidth
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Autocomplete
                  id="machine"
                  multiple={true}
                  options={
                    MachineList.map(obj => {
                      return {
                        id: obj.id,
                        name: obj.factory_serial_no
                      }
                    })
                  }
                  getOptionLabel={option => option.name}
                  getOptionSelected={(option, value) => option.name === value.name}
                  defaultValue={ recordForEdit ? recordForEdit.machine : [] }

                  onChange={(_event, machine) => {
                    if(machine){
                      formik.setFieldValue("machine", machine.map(obj => {
                        return {
                          id: obj.id,
                          name: obj.name
                        }
                      }))
                    }
                  }}
                  disabled = {true}
                  renderInput={params => (
                    <TextField {...params} label="Choose Machine" variant="outlined" />
                    )}
              />
            </Grid>
        </Grid>
    </Form>
  );
};

export default MRCDetails;
