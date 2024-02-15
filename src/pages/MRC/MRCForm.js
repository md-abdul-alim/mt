import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  MuiThemeProvider,
  TableCell,
  TextField,
  Tooltip,
  createMuiTheme,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Form } from "../../components/Form/useForm";
import { useFormik } from "formik";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import { CustomCircularProgress } from "../../components/Progress/CustomCircularProgress";
import Controls from "../../components/Controls/Controls";
import axios from "axios";
import { Autocomplete } from "@material-ui/lab";
import Confirm from "./Confirm";
import Notification from "../../components/SnackBar/Notification";

const initialFValues = {
  style: "",
  unit: "",
  plant: "",
  buyer: "",
  swm: [
    {
      line: "",
      start_date: new Date(),
      end_date: new Date(),
      swl: [
        {
          machine_type: "",
          machine_quantity: "",
        },
      ],
    },
  ],
};

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

const MRCForm = (props) => {
  const { addOrEdit, recordForEdit, AxiosHeader, isLoading, setIsLoading } =
    props;

  const getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MUIDataTableToolbar: {
          root: {
            backgroundColor: "#50d07d",
            color: "#fff",
          },
          icon: {
            color: "#fff",
            "&:hover": {
              color: "#0000ff",
            },
          },
        },
        MuiTableCell: {
          root: {
            padding: "2px",
            "&:last-child": {
              border: 0,
            },
          },
        },
        MuiTableRow: {
          root: {
            "&:nth-child(even)": {
              backgroundColor: "#89898940",
              color: "#fff",
            },
          },
        },
      },

      typography: {
        fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
      },
    });
  const [machineTypeList, setMachineTypeList] = useState([]);
  const [productionLine, setProductionLine] = useState([]);
  const [plants, setPlants] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [units, setUnits] = useState([]);
  const [confirmDeleteMrc, setConfirmDeleteMrc] = useState(false);
  const [deletedMrcData, setDeletedMrcData] = useState(null);
  const [confirmDeleteSWl, setConfirmDeleteSWL] = useState(false);
  const [confirmDeleteSwlData, setConfirmDeleteSWlData] = useState(null);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const validationSchema = Yup.object().shape({
    style: Yup.string().required("Style is required"),
    unit: Yup.number().required("Unit is required"),
    plant: Yup.number().required("Plant is required"),
    buyer: Yup.number().required("Buyer is required"),
    swm: Yup.array().of(
      Yup.object().shape({
        line: Yup.number().required("Line is required"),
        start_date: Yup.date().required("Start date is required"),
        end_date: Yup.date().required("End date is required"),
        swl: Yup.array().of(
          Yup.object().shape({
            machine_type: Yup.number().required("Machine type is required"),
            machine_quantity: Yup.number().required(
              "Machine quantity is required"
            ),
          })
        ),
      })
    ),
  });

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
    // Set loading state to true
    setIsLoading(true);

    // type list
    async function getMachineTypeList() {
      const response = await fetch("/api/machine/type/list/", AxiosHeader);
      const body = await response.json();
      setMachineTypeList(body);
    }

    // unit list
    async function getUnits() {
      const response = await fetch("/api/unit/name/list/", AxiosHeader);
      const body = await response.json();
      setUnits(body);
    }

    // production line list
    async function getProductionLine() {
      const response = await fetch("/api/production/line/list/", AxiosHeader);
      const body = await response.json();
      setProductionLine(body);
    }
    // planet List
    async function getPlant() {
      const response = await fetch("/api/plant/list/", AxiosHeader);
      const body = await response.json();
      setPlants(body);
    }
    // buyer list
    async function getBuyers() {
      const response = await fetch("/api/buyer/list/", AxiosHeader);
      const body = await response.json();
      setBuyers(body);
    }

    // Call all data fetching functions
    Promise.all([
      getMachineTypeList(),
      getUnits(),
      getProductionLine(),
      getPlant(),
      getBuyers(),
    ])
      .then(() => {
        // Set loading state to false once all data fetching is done
        setIsLoading(false);
      })
      .catch((error) => {
        // Handle errors if any
        console.error("Error fetching data:", error);
        // Set loading state to false to stop loading indicator in case of error
        setIsLoading(false);
      });
  }, []);

  const deleteStyleWiseLine = async (values) => {
    try {
      await axios
        .delete(
          `/api/style-wise-line-delete/${values.id}/`,
          values,
          AxiosHeader
        )
        .then((resp) => {
          // ToDO: adjust the update form
          setConfirmDeleteSWlData(null);
          setNotify({
            isOpen: true,
            message: "Deleted Successfully",
            type: "success",
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteStyleWiseMachineType = async (values) => {
    try {
      await axios
        .delete(
          `/api/style-wise-machines-type-delete/${values.id}/`,
          values,
          AxiosHeader
        )
        .then((resp) => {
          // ToDO: adjust the update form
          setDeletedMrcData(null);
          setNotify({
            isOpen: true,
            message: "Deleted Successfully",
            type: "success",
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const addNewItem = (value) => {
    const newSWMItem = {
      line: 1,
      start_date: new Date(),
      end_date: new Date(),
      swl: [
        {
          machine_type: 1,
          machine_quantity: 1,
        },
      ],
    };

    // Update form values with the new SWM item
    formik.setFieldValue("swm", [...formik.values.swm, newSWMItem]);
  };

  const handleRemoveMrc = (value) => {
    // Create a new array without the item at the specified index
    if (deletedMrcData?.rowData[0]) {
      deleteStyleWiseLine({ id: deletedMrcData?.rowData[0] });
      const updatedSWM = formik.values.swm.filter(
        (_, idx) => idx !== value?.rowIndex
      );

      // Update form values with the updated SWM array
      formik.setFieldValue("swm", updatedSWM);
      return;
    }
    const updatedSWM = formik.values.swm.filter(
      (_, idx) => idx !== value?.rowIndex
    );

    // Update form values with the updated SWM array
    formik.setFieldValue("swm", updatedSWM);
  };

  const addNewSWL = (rowData, swlData, swlIndex) => {
    const newSWLItem = {
      machine_type: 1,
      machine_quantity: 1,
    };

    // Update form values with the new SWL item
    formik.setFieldValue(`swm[${rowData?.rowIndex}].swl`, [
      ...formik.values.swm[rowData?.rowIndex].swl,
      newSWLItem,
    ]);
  };

  const removeSwl = (value) => {
    const rowData = value?.tableMeta;
    const swlIndex = value?.swlIndex;
    // Create a new array without the item at the specified index
    const findSwl = formik.values.swm[rowData?.rowIndex].swl.find(
      (_, idx) => idx === swlIndex
    );
    if (findSwl) {
      const updatedSWL = formik.values.swm[rowData?.rowIndex].swl.filter(
        (_, idx) => idx !== swlIndex
      );
      deleteStyleWiseMachineType({ id: findSwl?.id });
      // // Update form values with the updated SWL array
      formik.setFieldValue(`swm[${rowData?.rowIndex}].swl`, updatedSWL);
      return;
    }else{
      const updatedSWL = formik.values.swm[rowData?.rowIndex].swl.filter(
        (_, idx) => idx !== swlIndex
      );
      // // Update form values with the updated SWL array
      formik.setFieldValue(`swm[${rowData?.rowIndex}].swl`, updatedSWL);
    }
  };

  const handleLineChange = (value, swmIndex) => {
    // Update the form values with the new "line" for the specified "swm" item
    formik.setFieldValue(`swm[${swmIndex}].line`, value);
  };

  const handleStartDateChange = (value, swmIndex) => {
    // Update the form values with the new "start_date" for the specified "swm" item
    formik.setFieldValue(`swm[${swmIndex}].start_date`, value);
  };

  const handleEndDateChange = (value, swmIndex) => {
    // Update the form values with the new "start_date" for the specified "swm" item
    formik.setFieldValue(`swm[${swmIndex}].end_date`, value);
  };

  const updateMachineQuantity = (swmIndex, swlIndex, newQuantity) => {
    const updatedSWM = [...formik.values.swm];
    const updatedSWL = [...updatedSWM[swmIndex].swl];
    updatedSWL[swlIndex].machine_quantity = newQuantity;
    updatedSWM[swmIndex].swl = updatedSWL;
    formik.setFieldValue(`swm`, updatedSWM);
  };

  const updateMachineType = (swmIndex, swlIndex, newQuantity) => {
    const updatedSWM = [...formik.values.swm];
    const updatedSWL = [...updatedSWM[swmIndex].swl];
    updatedSWL[swlIndex].machine_type = newQuantity;
    updatedSWM[swmIndex].swl = updatedSWL;
    formik.setFieldValue(`swm`, updatedSWM);
  };

  const columns = [
    {
      name: "id",
      label: "ID",
      options: {
        filter: false,
        sort: false,
        display: false,
      },
    },
    {
      name: "line",
      label: "Line",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          const swmIndex = tableMeta.rowIndex;
          return (
            <>
              <Autocomplete
                id={`swm[${swmIndex}].line`}
                options={productionLine}
                getOptionLabel={(option) => option.name || ""}
                getOptionSelected={(option, value) => option.id === value}
                value={
                  productionLine.find((option) => option.id === value) || null
                }
                onChange={(value, newValue) => {
                  handleLineChange(newValue ? newValue.id : null, swmIndex);
                }}
                onBlur={formik.handleBlur}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Line"
                    variant="outlined"
                    error={
                      formik.touched[`swm[${swmIndex}].line`] &&
                      Boolean(formik.errors[`swm[${swmIndex}].line`])
                    }
                    helperText={
                      formik.touched[`swm[${swmIndex}].line`] &&
                      formik.errors[`swm[${swmIndex}].line`]
                    }
                    style={{ width: "250px" }}
                  />
                )}
              />
            </>
          );
        },
      },
    },
    {
      name: "start_date",
      label: "Start Date",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          const swmIndex = tableMeta.rowIndex;
          return (
            <>
              <Controls.DatePicker
                // label="Start Date"
                name={`swm[${swmIndex}].start_date`} // Update the name to access the correct "start_date"
                value={value}
                onChange={(value) => {
                  handleStartDateChange(value, swmIndex); // Pass the value and the index of the "swm" item
                }}
                onBlur={formik.handleBlur}
                autoFocus
                fullWidth
              />
            </>
          );
        },
      },
    },
    {
      name: "end_date",
      label: "End Date",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          const swmIndex = tableMeta.rowIndex;
          return (
            <>
              <Controls.DatePicker
                // label="End Date"
                name={`swm[${swmIndex}].end_date`} // Update the name to access the correct "start_date"
                value={value}
                onChange={(value) => {
                  handleEndDateChange(value, swmIndex); // Pass the value and the index of the "swm" item
                }}
                onBlur={formik.handleBlur}
                autoFocus={value}
                fullWidth
              />
            </>
          );
        },
      },
    },
    {
      name: "swl",
      label: "SWL Data",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>
              {value?.map((swlItem, swlIndex) => {
                const isLastItem = swlIndex === value.length - 1;
                const isOddIndex = swlIndex % 2 === 1;
                const gridContainerClassName = isOddIndex
                  ? "gray-background"
                  : "";
                return (
                  <div key={swlIndex}>
                    {/* Check if "swl" and its elements exist before accessing them */}
                    {swlItem && (
                      <>
                        <Grid
                          container
                          spacing={3}
                          sx={{ m: 2 }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Grid item xs={12} md={4}>
                            <Autocomplete
                              id={`swl[${swlIndex}].machine_type`}
                              options={machineTypeList}
                              getOptionLabel={(option) => option.name || ""}
                              getOptionSelected={(option, value) =>
                                option.id === value
                              }
                              value={
                                machineTypeList.find(
                                  (option) => option.id === swlItem.machine_type
                                ) || null
                              }
                              onChange={(event, newValue) => {
                                updateMachineType(
                                  tableMeta?.rowIndex,
                                  swlIndex,
                                  newValue ? newValue.id : null
                                );
                              }}
                              renderInput={(params) => (
                                <TextField
                                  style={{ width: "250px" }}
                                  {...params}
                                  label="Machine Type"
                                  variant="outlined"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Controls.Input
                              label="Machine Quantity"
                              name={`swl[${swlIndex}].machine_quantity`}
                              value={swlItem?.machine_quantity || ""}
                              onChange={(e) => {
                                updateMachineQuantity(
                                  tableMeta?.rowIndex,
                                  swlIndex,
                                  Number(e.target.value)
                                );
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                              }}
                            >
                              {isLastItem && (
                                <IconButton
                                  color="primary"
                                  onClick={() =>
                                    addNewSWL(tableMeta, swlItem, swlIndex)
                                  }
                                  style={{
                                    backgroundColor: "#019301",
                                    color: "white",
                                  }}
                                  size="small"
                                >
                                  <AddIcon />
                                </IconButton>
                              )}

                              <IconButton
                                color="primary"
                                onClick={() => {
                                  console.log(tableMeta, swlItem, swlIndex);
                                  // removeSwl(tableMeta, swlItem, swlIndex);
                                  setConfirmDeleteSWL(true);
                                  setConfirmDeleteSWlData({
                                    tableMeta,
                                    swlItem,
                                    swlIndex,
                                  });
                                }}
                                style={{
                                  backgroundColor: `${
                                    swlIndex === 0 && value?.length === 1
                                      ? "#ff000052"
                                      : "#e10707"
                                  }`,
                                  color: "white",
                                }}
                                disabled={swlIndex === 0 && value?.length === 1}
                                size="small"
                              >
                                <RemoveIcon />
                              </IconButton>
                            </div>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </div>
                );
              })}
            </>
          );
        },
      },
    },
    {
      name: "Actions",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          const isLastRow = tableMeta.rowIndex === formik.values.swm.length - 1;
          return (
            <div style={{ display: "flex", gap: "10px" }}>
              {isLastRow && (
                <IconButton
                  onClick={() => addNewItem(tableMeta)}
                  style={{ backgroundColor: "#019301", color: "white" }}
                  size="small"
                >
                  <AddIcon />
                </IconButton>
              )}
              <IconButton
                color="primary"
                onClick={() => {
                  setDeletedMrcData(tableMeta);
                  setConfirmDeleteMrc(true);
                }}
                style={{
                  backgroundColor: `${
                    tableMeta?.rowIndex === 0 && formik.values.swm.length === 1
                      ? "#ff000052"
                      : "#e10707"
                  }`,
                  color: "white",
                }}
                size="small"
                disabled={
                  tableMeta?.rowIndex === 0 && formik.values.swm.length === 1
                }
              >
                <RemoveIcon />
              </IconButton>
            </div>
          );
        },
      },
    },
  ];

  const options = {
    textLabels: {
      body: {
        noMatch: isLoading ? (
          <CustomCircularProgress
            size={70}
            thickness={5}
            color="secondary"
            message="Data is loading. Please do not close the tab..."
          />
        ) : (
          "Sorry, there is no matching data to display"
        ),
      },
    },
    filterType: "select",
    selectableRows: false,
    responsive: "standard",
    rowsPerPage: [20],
    rowsPerPageOptions: [],
    print: false,
    download: false,
  };

  return (
    <Form onSubmit={formik.handleSubmit}>
      <React.Fragment>
        <Grid container alignItems="flex-start" spacing={1}>
          <MuiThemeProvider theme={getMuiTheme()}>
            <Box style={{ width: "100%" }}>
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
                  <Autocomplete
                    id="unit"
                    options={units}
                    hide="true"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Unit name"
                        variant="outlined"
                        error={
                          formik.touched.unit && Boolean(formik.errors.unit)
                        }
                        helperText={formik.touched.unit && formik.errors.unit}
                      />
                    )}
                    getOptionLabel={(option) => option.name || ""}
                    getOptionSelected={(option, value) =>
                      option.id === value.id
                    }
                    value={
                      units.find((unit) => unit.id === formik.values.unit) ||
                      formik.values.unit ||
                      null
                    }
                    onChange={(_event, unit) => {
                      formik.setFieldValue("unit", unit ? unit.id : null);
                    }}
                    onBlur={formik.handleBlur}
                    // multiple='true'
                  />
                </Grid>
                <Grid item md={3} sm={4} xs={6}>
                  <Autocomplete
                    id="plant"
                    options={plants}
                    hide="true"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Plant"
                        variant="outlined"
                        error={
                          formik.touched.plant && Boolean(formik.errors.plant)
                        }
                        helperText={formik.touched.plant && formik.errors.plant}
                      />
                    )}
                    getOptionLabel={(option) => option.name || ""}
                    getOptionSelected={(option, value) =>
                      option.id === value.id
                    }
                    value={
                      plants.find((line) => line.id === formik.values.plant) ||
                      formik.values.plant ||
                      null
                    }
                    onChange={(_event, plant) => {
                      console.log("🚀 ~ MachineForm ~ plant:", plant);
                      formik.setFieldValue("plant", plant ? plant.id : null);
                    }}
                    onBlur={formik.handleBlur}
                    // multiple='true'
                  />
                </Grid>
                <Grid item md={3} sm={4} xs={6}>
                  <Autocomplete
                    id="buyer"
                    options={buyers}
                    hide="true"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Buyer Name"
                        variant="outlined"
                        error={
                          formik.touched.buyer && Boolean(formik.errors.buyer)
                        }
                        helperText={formik.touched.buyer && formik.errors.buyer}
                      />
                    )}
                    getOptionLabel={(option) => option.name || ""}
                    getOptionSelected={(option, value) =>
                      option.id === value.id
                    }
                    value={
                      buyers.find(
                        (buyer) => buyer.id === formik.values.buyer
                      ) ||
                      formik.values.buyer ||
                      null
                    }
                    onChange={(_event, buyer) => {
                      formik.setFieldValue("buyer", buyer ? buyer.id : null);
                    }}
                    onBlur={formik.handleBlur}
                    // multiple='true'
                  />
                </Grid>

                <Grid md={12} sm={4} xs={6} item style={{ marginTop: 10 }}>
                  {/* Table */}
                  {isLoading ? (
                    <MUIDataTable
                      title={"Line wise machine type"}
                      columns={columns}
                      options={options}
                      className={classes.pageContent}
                    />
                  ) : (
                    <MUIDataTable
                      title={"Line wise machine type"}
                      data={formik.values.swm}
                      columns={columns}
                      options={options}
                      className={classes.pageContent}
                    />
                  )}

                  <TableCell className={classes.MuiTableCell} />
                </Grid>

                <Grid md={12} sm={4} xs={6} item style={{ marginTop: 10 }}>
                  <div className={classes.wrapper}>
                    <Controls.Button
                      buyer="submit"
                      disabled={formik.isSubmitting}
                      type="submit"
                      text="Submit"
                    />
                    {formik.isSubmitting && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                    <Controls.Button
                      text="Reset"
                      color="default"
                      onClick={formik.resetForm}
                    />
                  </div>
                </Grid>
              </Grid>
            </Box>
            <div>
              <Confirm
                open={confirmDeleteMrc}
                setConfirmDelete={setConfirmDeleteMrc}
                onClose={() => setConfirmDeleteMrc(false)}
                actionText="delete"
                onConfirm={handleRemoveMrc}
                value={deletedMrcData}
              />
              {/* for swl delete */}
              <Confirm
                open={confirmDeleteSWl}
                setConfirmDelete={setConfirmDeleteSWL}
                onClose={() => setConfirmDeleteSWL(false)}
                actionText="delete"
                onConfirm={removeSwl}
                value={confirmDeleteSwlData}
              />
            </div>
            <Notification notify={notify} setNotify={setNotify} />
          </MuiThemeProvider>
        </Grid>
      </React.Fragment>
    </Form>
  );
};

export default MRCForm;
