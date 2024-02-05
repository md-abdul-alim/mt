import React, { useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import MUIDataTable from "mui-datatables";
import EditIcon from "@material-ui/icons/Edit";
import axios from "axios";
import IconButton from "@material-ui/core/IconButton";
import Popup from "../../components/Controls/Popup";
import Notification from "../../components/SnackBar/Notification";
import { makeStyles, Tooltip } from "@material-ui/core";
import {LineNameForm} from "./LineNameForm";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
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

export default function LineName() {
  const classes = useStyles();
  const [lineNameList, setLineNameList] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [fabricTypeRecord, setFabricTypeRecord] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  var userType = localStorage.getItem('user_type');

  const AxiosHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    },
  }

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
            padding: userType == 'Admin' ? '6px' : '10px',
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

  async function fetchLineNames() {
    try {
    setIsLoading(true);
      await axios
        .get("/api/line/list/", AxiosHeader)
        .then((res) => {
          setLineNameList(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  const postLineName = async (values, setSubmitting) => {
    const requestOptions = {
      headers: {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      },
    };

    try {
      await axios
        .post("/api/line/create/", values, AxiosHeader)
        .then((resp) => {
          setFabricTypeRecord(resp.data);
          setSubmitting(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateLineName = async (values, setSubmitting) => {
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
        .put(`/api/line/update/${values.id}/`, values, AxiosHeader)
        .then((resp) => {
          setFabricTypeRecord(resp.data);
          setSubmitting(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    fetchLineNames();
  }, [fabricTypeRecord]);

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
      name: "unit_name",
      label: "Unit",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "category_name",
      label: "Category",
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
          tableMeta.tableData.forEach(function (fabricType) {
            if (fabricType.id == tableMeta.rowData[0])
              return (item = fabricType);
          });
          return (
            <>
              {
              userType == 'Admin' ? 
              <IconButton
                color="primary"
                onClick={() => {
                  openInPopup(item);
                }}
              >
                <EditIcon fontSize="default" />
              </IconButton> : ''
              }
            </>
          );
        },
      },
    },
  ];

  const addOrEdit = (fabricType, resetForm, setSubmitting) => {
    if (fabricType.id === 0) postLineName(fabricType, setSubmitting);
    else updateLineName(fabricType, setSubmitting);
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
              setOpenPopup(true);
              setRecordForEdit(null);
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
        title={"Line Name List"}
        data={lineNameList}
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
        title="Line Name Form"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <LineNameForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} lineNameList={lineNameList} />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
    </div>
    </MuiThemeProvider>
    </Box>
  </React.Fragment>
  );
}
