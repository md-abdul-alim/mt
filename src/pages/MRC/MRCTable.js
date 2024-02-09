import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  MuiThemeProvider,
  TableCell,
  Tooltip,
  createMuiTheme,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Controls from "../../components/Controls/Controls";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import * as Yup from "yup";
import { Form } from "../../components/Form/useForm";
import { useFormik } from "formik";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import { CustomCircularProgress } from "../../components/Progress/CustomCircularProgress";

const initialFValues = {
  style: "",
  unit_name: 1,
  plant_name: 1,
  buyer_name: 1,
  swm: [
    {
      line: 1,
      start_date: new Date(),
      end_date: new Date(),
      swl: [
        {
          machine_type: 1,
          machine_quantity: 1,
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

const MRCTable = () => {
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
  const [typeList, setTypeList] = useState([]);
  const [nameList, setNameList] = useState([]);
  const [productionLine, setProductionLine] = useState([]);
  const [plants, setPlants] = useState([]);
  const [buyers, setbuyers] = useState([]);
  const [units, setUnits] = useState([]);

  const [mrcData, setMrcData] = useState([
    {
      id: 1,
      line: 11,
      start_date: "2024-01-31T18:25:34+06:00",
      end_date: "2024-01-31T18:25:42+06:00",
      swl: [
        {
          id: 3,
          machine_type: 62,
          machine_quantity: 1,
        },
      ],
    },
    {
      id: 2,
      line: 11,
      start_date: "2024-01-31T18:25:34+06:00",
      end_date: "2024-01-31T18:25:42+06:00",
      swl: [
        {
          id: 3,
          machine_type: 62,
          machine_quantity: 1,
        },
      ],
    },
  ]);

  // const { addOrEdit, recordForEdit, MachineList } = props;

  const validationSchema = Yup.object().shape({
    style: Yup.string().required("Style is required"),
    unit_name: Yup.number().required("Unit name is required"),
    plant_name: Yup.number().required("Plant name is required"),
    buyer_name: Yup.number().required("Buyer name is required"),
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
      console.log("🚀 ~ MRCTable ~ values:", values);
      setSubmitting(false);
    },
  });


  // useEffect(() => {
  //   if (recordForEdit != null)
  //     formik.setValues({
  //       ...recordForEdit,
  //     });
  // }, [recordForEdit]);

  useEffect(() => {
    // type list
    async function getTypeList() {
      const response = await fetch("/api/machine/type/list/", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-buyer": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const body = await response.json();
      setPlants(body);
    }

    // name list

    async function getUnits() {
      const response = await fetch("/api/unit/name/list/", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-buyer": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const body = await response.json();
      setNameList(body);
    }

    // production line list
    async function getProductionLine() {
      const response = await fetch("/api/production/line/list/", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-buyer": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const body = await response.json();
      setProductionLine(body);
    }
    // planet List
    async function getplant() {
      const response = await fetch("/api/plant/list/", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-buyer": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const body = await response.json();
      setPlants(body);
    }
    // buyer list
    async function getbuyers() {
      const response = await fetch("/api/buyer/list/", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-buyer": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const body = await response.json();
      setbuyers(body);
    }

    getTypeList();
    getUnits();
    getProductionLine();
    getplant();
    getbuyers();
  }, []);

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
    const updatedSWM = formik.values.swm.filter(
      (_, idx) => idx !== value?.rowIndex
    );

    // Update form values with the updated SWM array
    formik.setFieldValue("swm", updatedSWM);
  };

  const addNewSWL = (rowData, swlData, swlIndex) => {
    const newSWLItem = {
      id: formik.values.swm[rowData?.rowIndex].swl.length + 1, // Generate a new ID for the new SWL item
      machine_type: 1,
      machine_quantity: 1,
    };

    // Update form values with the new SWL item
    formik.setFieldValue(`swm[${rowData?.rowIndex}].swl`, [
      ...formik.values.swm[rowData?.rowIndex].swl,
      newSWLItem,
    ]);
  };

  const removeSwl = (rowData, swlData, swlIndex) => {
    // Create a new array without the item at the specified index
    const updatedSWL = formik.values.swm[rowData?.rowIndex].swl.filter(
      (_, idx) => idx !== swlIndex
    );

    // Update form values with the updated SWL array
    formik.setFieldValue(`swm[${rowData?.rowIndex}].swl`, updatedSWL);
  };

  const addSWMOnChange = (e, i, fieldName) => {
    formik.setFieldValue(
      `swm[${i}].${fieldName}`,
      e?.value || e?.target?.value
    );
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
              <Controls.Select
                label="Line"
                name={`swm[${swmIndex}].line`}
                value={value}
                onChange={(value) =>
                  handleLineChange(value?.target?.value, swmIndex)
                }
                onBlur={formik.handleBlur}
                // options={productionLine}
                options={nameList}
                error={
                  formik.touched[`swm[${swmIndex}].line`] &&
                  Boolean(formik.errors[`swm[${swmIndex}].line`])
                }
                helperText={
                  formik.touched[`swm[${swmIndex}].line`] &&
                  formik.errors[`swm[${swmIndex}].line`]
                }
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
                return (
                  <div key={swlIndex}>
                    {/* Check if "swl" and its elements exist before accessing them */}
                    {swlItem && (
                      <>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={4}>
                            <Controls.Select
                              label="Machine Type"
                              name={`swl[${swlIndex}].machine_type`}
                              value={swlItem.machine_type}
                              onChange={(e) => {
                                updateMachineType(
                                  tableMeta?.rowIndex,
                                  swlIndex,
                                  Number(e.target.value)
                                );
                              }}
                              options={nameList} // Provide options for machine types
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
                            <div>
                              <IconButton
                                color="primary"
                                onClick={() =>
                                  addNewSWL(tableMeta, swlItem, swlIndex)
                                }
                              >
                                <AddIcon fontSize="medium" />
                              </IconButton>
                              <IconButton
                                color="primary"
                                onClick={() =>
                                  removeSwl(tableMeta, swlItem, swlIndex)
                                }
                                disabled={swlIndex === 0 && value?.length === 1}
                              >
                                <RemoveIcon fontSize="medium" />
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
          return (
            <>
              <IconButton color="primary" onClick={() => addNewItem(tableMeta)}>
                <AddIcon fontSize="medium" />
              </IconButton>
              <IconButton
                color="primary"
                onClick={() => handleRemoveMrc(tableMeta)}
                disabled={tableMeta?.rowIndex === 0 && formik.values.swm.length === 1}
              >
                <RemoveIcon fontSize="medium" />
              </IconButton>
            </>
          );
        },
      },
    },
  ];

  const options = {
    textLabels: {
      body: {
        noMatch: false ? (
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
    selectableRows: "multiple",
    responsive: "standard",
    selectableRows: "multiple",
    rowsPerPage: [20],
    rowsPerPageOptions: [20, 50, 100, 200],
    print: false,
    download: false,
  };


  return (
    <Form onSubmit={formik.handleSubmit}>
      <React.Fragment>
        <Box position="relative">
          <MuiThemeProvider theme={getMuiTheme()}>
            <Box
              sx={{
                m: 5,
              }}
            >
              <BreadCrumb routeSegments={[{ name: "MRCs Table" }]} />

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
                    name="unit_name"
                    value={formik.values.unit_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    options={nameList}
                    error={
                      formik.touched.unit_name &&
                      Boolean(formik.errors.unit_name)
                    }
                    helperText={
                      formik.touched.unit_name && formik.errors.unit_name
                    }
                  />
                </Grid>
                <Grid item md={3} sm={4} xs={6}>
                  <Controls.Select
                    label="Plant"
                    name="plant_name"
                    value={formik.values.plant_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    options={plants}
                    error={
                      formik.touched.plant_name &&
                      Boolean(formik.errors.plant_name)
                    }
                    helperText={
                      formik.touched.plant_name && formik.errors.plant_name
                    }
                  />
                </Grid>
                <Grid item md={3} sm={4} xs={6}>
                  <Controls.Select
                    label="Buyer Name"
                    name="buyer_name"
                    value={formik.values.buyer_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    // options={buyers}
                    options={plants}
                    error={
                      formik.touched.buyer_name &&
                      Boolean(formik.errors.buyer_name)
                    }
                    helperText={
                      formik.touched.buyer_name && formik.errors.buyer_name
                    }
                  />
                </Grid>

                <Grid md={12} sm={4} xs={6} item style={{ marginTop: 10 }}>
                  {/* Table */}
                  <MUIDataTable
                    title={"MRC List"}
                    data={formik.values.swm}
                    columns={columns}
                    options={options}
                    className={classes.pageContent}
                  />
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
          </MuiThemeProvider>
        </Box>
      </React.Fragment>
    </Form>
  );
};

export default MRCTable;