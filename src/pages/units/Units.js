import React, { useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import MUIDataTable from "mui-datatables";
import EditIcon from "@material-ui/icons/Edit";
import axios from "axios";
import IconButton from "@material-ui/core/IconButton";
import Popup from "../../components/Controls/Popup";
import Notification from "../../components/SnackBar/Notification";
import { makeStyles, Tooltip } from "@material-ui/core";
import UnitForm from "./UnitForm";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { CustomCircularProgress } from "../../components/Progress/CustomCircularProgress";
import { Box } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  pageContent: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    padding: theme.spacing(3),
  },
  iconButtonColor: {
    color: "#fff",
    "&:hover": {
      color: "#0000ff",
    },
  },
}));

export default function Units() {
  const classes = useStyles();
  const [unitList, setUnitList] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [washTypesRecord, setUnitRecord] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const user_type = localStorage.getItem("user_type")

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

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
        root: {  //This can be referred from Material UI API documentation. 
            padding: '6px',
        },
      },
    },
    typography: {
      "fontFamily": `"Roboto", "Helvetica", "Arial", sans-serif`,
      "fontSize": 14,
      "fontWeightLight": 300,
      "fontWeightRegular": 400,
      "fontWeightMedium": 500
     }
  });

  const AxiosHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    },
  }

  async function fetchUnits() {
    setIsLoading(true);
    try {
      await axios
        .get("/api/unit/list/", AxiosHeader)
        .then((res) => {
          setUnitList(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  const postUnit = async (values, setSubmitting) => {

    try {
      await axios
        .post("/api/unit/create/", values, AxiosHeader)
        .then((resp) => {
          setUnitRecord(resp.data);
          setSubmitting(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateUnit = async (values, setSubmitting) => {

    try {
      await axios
        .put(`/api/unit/update/${values.id}/`, values, AxiosHeader)
        .then((resp) => {
          setUnitRecord(resp.data);
          setSubmitting(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    fetchUnits();
  }, [washTypesRecord]);

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
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
      name: "name",
      label: "Unit Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    // {
    //   name: "company",
    //   label: "Company",
    //   options: {
    //     filter: true,
    //     sort: true,
    //   },
    // },
    // {
    //   name: "department",
    //   label: "Department",
    //   options: {
    //     filter: true,
    //     sort: true,
    //   },
    // },
    {
      name: "parent_machines",
      label: "Total Own Machines",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "rejected_machines",
      label: "Rejected Machines",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "loan_to",
      label: "Loan To",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "loan_from",
      label: "Loan From",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "production_lines",
      label: "Production Lines",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "support_lines",
      label: "Support Lines",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "production_active_machines",
      label: "Production Line Active Machines",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "support_active_machines",
      label: "Support Line Active Machines",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "transfer_machines",
      label: "On Transfer",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "ideal_machines",
      label: "IDLE Machines",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "current_machines",
      label: "Total Inventory Machines",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "Actions",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          let item;
          tableMeta.tableData.forEach(function (washType) {
            if (washType.id === tableMeta.rowData[0])
              return (item = washType);
          });
          return (
            <>
              <IconButton
                color="primary"
                onClick={() => {
                  if (user_type === 'Admin'){
                    openInPopup(item);
                  }else{
                    alert("You have no Update permission")
                  }
                }}
              >
                <EditIcon fontSize="default" />
              </IconButton>
            </>
          );
        },
      },
    },
  ];

  const addOrEdit = (washType, resetForm, setSubmitting) => {
    if (washType.id === 0) postUnit(washType, setSubmitting);
    else updateUnit(washType, setSubmitting);
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
    setNotify({
      isOpen: true,
      message: "Submitted Successfully",
      type: "success",
    });
  };

  const options = {
    filterType: "dropdown",
    selectableRows: "none",
    responsive: "standard",
    customToolbar: () => {
      return (
        <Tooltip title={"Add New"}>
          <IconButton className={classes.iconButtonColor}
            onClick={() => {
              if (user_type === 'Admin'){
                setOpenPopup(true);
              setRecordForEdit(null);
              }else{
                alert("You have no Add permission")
              }
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      );
    },
    print: false,
    download: false,
  };

  return (
        <React.Fragment>
          <Box position="relative">
            <MuiThemeProvider theme={getMuiTheme()}>
              <div>
                <MUIDataTable
                  title={"Unit List"}
                  data={unitList}
                  columns={columns}
                  options={options}
                  className={classes.pageContent}
                />
                  {isLoading && (
                    <Box position="absolute" top="60%" left="40%" transform="translate(-50%, -50%)">
                      <CustomCircularProgress size={50} thickness={6} color="secondary" message="Data is loading. Please do not close the tab..." />
                    </Box>
                  )}
                <Popup
                  title="Unit Form"
                  openPopup={openPopup}
                  setOpenPopup={setOpenPopup}
                >
                  <UnitForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} washTypesList={unitList} />
                </Popup>
                <Notification notify={notify} setNotify={setNotify} />
              </div>
            </MuiThemeProvider>
          </Box>
      </React.Fragment>
  );
}
