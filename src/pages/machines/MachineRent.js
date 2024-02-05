import React, { useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import MUIDataTable from "mui-datatables";
import EditIcon from "@material-ui/icons/Edit";
import axios from "axios";
import IconButton from "@material-ui/core/IconButton";
import Popup from "../../components/Controls/Popup";
import Notification from "../../components/SnackBar/Notification";
import { makeStyles, Tooltip } from "@material-ui/core";
import {MachineRentForm} from "./MachineRentForm";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

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

export default function MachineRent() {
  const classes = useStyles();
  const [rentMachineList, setRentMachineList] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [fabricTypeRecord, setFabricTypeRecord] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);

  var userType = localStorage.getItem('user_type');
  var unit = localStorage.getItem('unit');


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

  const AxiosHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    },
  }

  async function fetchRentMachine() {

    try {
      await axios
        .get("/api/rent/machine/list/", AxiosHeader)
        .then((res) => {
          setRentMachineList(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  const postRentMachine = async (values, setSubmitting) => {

    try {
      await axios
        .post("/api/rent/machine/create/", values, AxiosHeader)
        .then((resp) => {
          setFabricTypeRecord(resp.data);
          setSubmitting(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateRentMachine = async (values, setSubmitting) => {

    try {
      await axios
        .put(`/api/rent/machine/update/${values.id}/`, values, AxiosHeader)
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
    fetchRentMachine();
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
              ((userType === 'Maintenance Head' || userType === 'IE Head' || userType == 'Maintenance Coordinate') && (item.unit_name === unit)) || userType === 'Admin'  ? 
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
    if (fabricType.id === 0) postRentMachine(fabricType, setSubmitting);
    else updateRentMachine(fabricType, setSubmitting);
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
    // customToolbar: () => {
    //   return (
    //     <Tooltip title={"Add New"}>
    //       <IconButton className={classes.iconButtonColor}
    //         onClick={() => {
    //           setOpenPopup(true);
    //           setRecordForEdit(null);
    //         }}
    //       >
    //         <AddIcon />
    //       </IconButton>
    //     </Tooltip>
    //   );
    // },
    print: false,
    download: false,
  };

  return (
    <MuiThemeProvider theme={getMuiTheme()}>
    <div>
      <MUIDataTable
        title={"Rent Machine"}
        data={rentMachineList}
        columns={columns}
        options={options}
        className={classes.pageContent}
      />
      <Popup
        title="Rent Machine Form"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <MachineRentForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} rentMachineList={rentMachineList} />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
    </div>
    </MuiThemeProvider>
  );
}
