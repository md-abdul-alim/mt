import React, { useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import MUIDataTable from "mui-datatables";
import EditIcon from "@material-ui/icons/Edit";
// import {Fab} from "@material-ui/core";
import axios from "axios";
import IconButton from "@material-ui/core/IconButton";
import FormDialog from "../../../components/FormDialog/FormDialog";
import Popup from "../../../components/Controls/Popup";
import Notification from "../../../components/SnackBar/Notification";
import { makeStyles, Tooltip } from "@material-ui/core";
import AddMachineToLineForm from "./AddMachineToLineForm";
import UpdateMachineToLineForm from "./UpdateMachineToLineForm";
import AddMachineToLineByBarcodeForm from "./AddMachineToLineByBarcodeForm";
import BarcodeScanner from "../../../components/Barcode/BarcodeScanner";
import FullScreenPopup from "../../../components/FullScreenPopup/FullScreenPopup";
import CropFreeIcon from '@material-ui/icons/CropFree';
import Controls from "../../../components/Controls/Controls";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { CustomCircularProgress } from "../../../components/Progress/CustomCircularProgress";
import { Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  pageContent: {
    marginLeft: theme.spacing(2),
    padding: theme.spacing(3),
  },
}));

export default function ProductionLine() {
  const classes = useStyles();
  const [addMachineToLineList, setAddMachineToLineList] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [lineRecord, setLineRecord] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(null);
  const [updateSignal, setUpdateSignal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const user_type = localStorage.getItem("user_type")
  const unit = localStorage.getItem("unit")

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
            padding:'1px',
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

  async function fetchCompositions() {
    const requestOptions = {
      headers: {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    };

    try {
      setIsLoading(true);
      await axios
        .get(`/api/production/line/machine/list/${unit}/`, AxiosHeader)
        .then((res) => {
          setAddMachineToLineList(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }


  const addLine = async (values, setSubmitting) => {
    try {
      await axios
        .post(`/api/add/machine/to/production/line/`, values, AxiosHeader)
        .then((resp) => {
          setLineRecord(resp.data);
          setSubmitting(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateLine = async (values, setSubmitting) => {
    try {
      await axios
        .put(`/api/production/machine/line/update/`, values, AxiosHeader)
        .then((resp) => {
          setLineRecord(resp.data);
          setSubmitting(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const removeMachineFromLine = async (values) => {
    await axios
      .delete(`/api/remove/machine/from/production/line/`, {
        params: { id: values.id },
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
      }) 
      .then((resp) => {
        setUpdateSignal(resp.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    };

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    fetchCompositions();
  }, [lineRecord, updateSignal]);

  const openInUpdatePopup = (item) => {
    setRecordForEdit(item);
    setOpenUpdatePopup(true);
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
      name: "line_name",
      label: "Lines",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "name",
      label: "Machines",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "factory_serial_no",
      label: "Factory Serial Number",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "machine_status",
      label: "Machine Status",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "Actions",
      options: {
        filter: false,
        // display: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          let item;
          tableMeta.tableData.forEach(function (machine) {
            if (machine.id == tableMeta.rowData[0]) return (item = machine);
          });
          return (
            <>
              <IconButton
                color="primary"
                onClick={() => {
                  openInUpdatePopup(item);
                }}
              >
                <Controls.Button
                  type="submit"
                  text="Update"
                  // style={{backgroundColor: "red"}}
                />
                {/* <Fab color='primary' size="small" arial-label='edit'>
                    <EditIcon />
                </Fab> */}
              </IconButton>
              <IconButton
                color="primary"
                onClick={() => {
                  if (item.unit_name === unit && (user_type === 'Maintenance Head' || user_type === 'Maintenance Coordinate' || user_type === 'Admin')){
                    removeMachineFromLine(item);
                  }else{
                    alert("You have no IDLE permission.")
                  }
                }}
              >
                <Controls.Button
                  type="submit"
                  text="IDLE"
                  style={{backgroundColor: "red"}}
                />
              </IconButton>
            </>
          );
        },
      },
    },
  ];

  const addOrEdit = (line, resetForm, setSubmitting) => {
    if (line.id === 0) addLine(line, setSubmitting);
    else updateLine(line, setSubmitting);
    resetForm();
    setOpenPopup(false);
    setOpenPopup2(false);
    setOpenUpdatePopup(false);
    setNotify({
      isOpen: true,
      message: "Submitted Successfully",
      type: "success",
    });
  };

  const edit = (line, resetForm, setSubmitting) => {
    updateLine(line, setSubmitting);
    resetForm();
    setOpenPopup(false);
    setOpenPopup2(false);
    setOpenUpdatePopup(false);
    setNotify({
      isOpen: true,
      message: "Update Successfully",
      type: "success",
    });
  };

  const ideal = (machine) => {
    removeMachineFromLine(machine);
    setOpenPopup(false);
    setOpenPopup2(false);
    setOpenUpdatePopup(false);
    setNotify({
      isOpen: true,
      message: "Ideal Successfully",
      type: "success",
    });
  };

  const options = {
    filterType: "dropdown",
    selectableRows: "none",
    responsive: "standard",
    customToolbar: () => {
      return (
        <>
        <Tooltip title={"Add New"}>
          <IconButton className={classes.iconButtonColor}
            onClick={() => {
              setOpenPopup(true);
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
         <Tooltip title={"Scan Barcode"}>
         <IconButton className={classes.iconButtonColor}
           onClick={() => {
             setOpen(true);
           }}
         >
           <CropFreeIcon />
         </IconButton>
       </Tooltip>
        </>
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
              title={"Production Line Machines"}
              data={addMachineToLineList}
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
              title="Add Machine in Line Form"
              openPopup={openPopup}
              setOpenPopup={setOpenPopup}
              maxWidth="xs"
            >
              <AddMachineToLineForm recordForEdit={recordForEdit} addOrEdit={addOrEdit}  />
            </Popup>

            <Popup
              title="Update Machine in Line Form"
              openPopup={openUpdatePopup}
              setOpenPopup={setOpenUpdatePopup}
              maxWidth="xs"
            >
              <UpdateMachineToLineForm recordForEdit={recordForEdit} addOrEdit={addOrEdit}  />
            </Popup>

            <Popup
              title="Barcode Scanning Details"
              openPopup={openPopup2}
              setOpenPopup={setOpenPopup2}
            >
              <AddMachineToLineByBarcodeForm addOrEdit={edit} ideal={ideal} searchValue={searchValue}/>
            </Popup>
            <FullScreenPopup
                title="Barcode Scanner"
                open={open}
                setOpen={setOpen}
              >
                <BarcodeScanner setOpenPopup2={setOpenPopup2} setOpen={setOpen} setSearchValue = {setSearchValue} />
              </FullScreenPopup>
            <Notification notify={notify} setNotify={setNotify} />
          </div>
      </MuiThemeProvider>
      </Box>
  </React.Fragment>
  );
}
