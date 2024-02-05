import React, { useState, useEffect } from "react";
import clsx from 'clsx';
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import UploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import MUIDataTable from "mui-datatables";
import EditIcon from "@material-ui/icons/Edit";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import CropFreeIcon from '@material-ui/icons/CropFree';
import CloseIcon from "@material-ui/icons/Close";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import { Box } from '@material-ui/core';
import { CustomCircularProgress } from "../../components/Progress/CustomCircularProgress";
import {
  useMachineState,
  useMachineDispatch,
  MachineProvider,
  initialState,
  MachineList,
} from "../../context/index";
import useTable from "../../components/Table/useTable";
import Controls from "../../components/Controls/Controls";
import Popup from "../../components/Controls/Popup";
import Upload from "../../components/Controls/Upload";
import FullScreenPopup from "../../components/FullScreenPopup/FullScreenPopup";
import Notification from "../../components/SnackBar/Notification";
import BarcodeScanner from "../../components/Barcode/BarcodeScanner";
import MachineForm from "./hook/MachineForm";

import {
  makeStyles,
  TableCell,
  Tooltip
} from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
  },
  searchInput: {
    width: "75%",
  },
  newButton: {
    position: "absolute",
    right: "10px",
  },
  iconButtonColor: {
    color: "#fff",
    '&:hover': {
      color: "#0000ff"
  }
  }
}));


function MRC() {
  const classes = useStyles();
  const getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableToolbar: {
        root: {
          backgroundColor: "#50d07d",
          color: "#fff"
        },
        icon: {
          color: "#fff",
          '&:hover': {
               color: "#0000ff"
           }
       },
      },
      MuiTableCell: {
        root: {
            padding: '2px',
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
  })
  const [isLoading, setIsLoading] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [records, setRecords] = useState(null);
  const [fabricRecord, setFabricRecord] = useState(null);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [openPopup, setOpenPopup] = useState(false);
  const [open, setOpen] = useState(false);
  const [upload, setUpload] = useState(false);
  const [MachineList, setMachineList] = useState([]);
  const [fiber, setFiber] = useState([]);

  const user_type = localStorage.getItem("user_type")
  const unit = localStorage.getItem("unit")

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const dispatch = useMachineDispatch();
  const { fabricList, loading, errorMessage } = useMachineState(); //read the values of loading and errorMessage from context

  const fetchMachineList = async () => {
    try {
      await MachineList(dispatch);
    } catch (error) {
      console.log(error);
    }
  };

  const AxiosHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    },
  }

  async function fetchMachines() {
    setIsLoading(true);
    try {
      await axios
        .get(`/api/machine/per/unit/list/${localStorage.getItem("unit_id")}/`, AxiosHeader)
        .then((res) => {
          setMachineList(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchMachineDetail(id) {
    setIsLoading(true);
    try {
      await axios
        .get(`/api/machine/detail/${id}/`, AxiosHeader)
        .then((res) => {
          setRecordForEdit(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  const postMachine = async (values, setSubmitting) => {
    try {
      await axios
        .post("/api/machine/create/", values, AxiosHeader)
        .then((resp) => {
          setFabricRecord(resp.data);
          // alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateMachine = async (values, setSubmitting) => {

    try {
      await axios
        .put(`/api/machine/update/${values.id}/`, values, AxiosHeader)
        .then((resp) => {
          setFabricRecord(resp.data);
          // alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        });
    } catch (error) {
      console.log(error);
    }
  };


  async function fetchFilterMachineList(values, setSubmitting) {
    setIsLoading(true);
    try {
      await axios
        .get("/api/machine/filter/per/unit/list/", {
          params: values,
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
          },
        })
        .then((res) => {
          setMachineList(res.data);
          setIsLoading(false);
          setSubmitting(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  const downloadMachineBarcode = async (values) => {
    try{
      await axios({
        url: `/api/barcode/download/`,
        method: 'POST',
        responseType: 'blob',
        data: values,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
      }).then((response) => {
         const url = window.URL.createObjectURL(new Blob([response.data]));
         const link = document.createElement('a');
         link.href = url;
         link.setAttribute('download', 'machine-barcode-stickers.pdf');
         document.body.appendChild(link);
         link.click();
      });
    } catch(error){
      console.log(error)
    }
  };

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    fetchMachineList();
    fetchMachines();
    // async function getMachine() {
    //   const response = await fetch("/api/machine/list");
    //   const body = await response.json();
    //   setFiber(body);
    // }
    // getMachine();
  }, [fabricRecord, searchOpen]);


  const openInPopup = (item) => {
    fetchMachineDetail(item.id)
    // setRecordForEdit(item);
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
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "model_no",
      label: "Model No",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "parent_unit_name",
      label: "Parent Unit",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "current_unit_name",
      label: "Current Unit",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "line",
      label: "Line",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "category_value",
      label: "Category",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "type_value",
      label: "Type",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "brand",
      label: "Brand",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "factory_serial_no",
      label: "Factory serial no",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "manufacture_serial_no",
      label: "Manufacture serial no",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "status_value",
      label: "Status",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Actions",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          let item;
          tableMeta.tableData.forEach(function (fabric) {
            if (fabric.id == tableMeta.rowData[0]) return (item = fabric);
          });
          return (
            <>
              <IconButton
                color="primary"
                onClick={() => {
                  if ((item.parent_unit_name === unit && user_type === 'Maintenance Head') || (item.parent_unit_name === unit && user_type === 'Maintenance Coordinate') || (item.parent_unit_name === unit && user_type === 'IE Head') || user_type === 'Admin'){
                    openInPopup(item);
                  }else{
                    alert("You have no update permission")
                  }
                  // openInPopup(item);
                }}
              >
                <EditIcon fontSize="medium" />
              </IconButton>
              <Link
                to={{
                  pathname: "/app/machine/details",
                  state: item.id,
                }}
              >
                <IconButton color="primary">
                  <ArrowRightAltIcon fontSize="medium" />
                </IconButton>
              </Link>
            </>
          );
        },
      },
    },
  ];


  const addOrEdit = (machine, resetForm, setSubmitting) => {
    if (machine.id == 0) postMachine(machine, setSubmitting);
    else updateMachine(machine, setSubmitting);
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
    setNotify({
      isOpen: true,
      message: "Submitted Successfully",
      type: "success",
    });
  };

  const filterFunction = (machine, resetForm, setSubmitting) => {
    if (machine.id === 0)
      fetchFilterMachineList(machine, setSubmitting);
    resetForm();
    setRecordForEdit(null);
    setNotify({
      isOpen: true,
      message: "Data is loading. Please Wait...",
      type: "success",
    });
  };

  const options = {
    textLabels: {
      body: {
        noMatch: isLoading ?
                    <CustomCircularProgress size={70} thickness={5} color="secondary" message="Data is loading. Please do not close the tab..." /> : 'Sorry, there is no matching data to display',
      }
    },
    filterType: "select",
    selectableRows: "multiple",
    responsive: "standard",
    selectableRows: 'multiple',
    rowsPerPage: [20],
    rowsPerPageOptions: [20, 50, 100, 200],
    onRowSelectionChange : (curRowSelected, allRowsSelected, rowData) => {
      const indexesToPrint = curRowSelected.map((row, k) => row.index);

      for (let i = 0; i < fabricList.length; i++) {
        if(indexesToPrint.includes(i)) {
          if(fabricList[i].dekko_reference.length>50 || fabricList[i].weight_with_unit.length>30 || fabricList[i].fabric_composition.length>70 ){
            alert("Uncheck this fabric. This will break the QR code.");
            // setBrokenFabric(indexesToPrint)
          }
        }
      }
    },

    customToolbarSelect: selectedRows => (
      <IconButton
        onClick={() => {
          const indexesToPrint = selectedRows.data.map((row, k) => row.dataIndex);
          let accept_list = [];
            for (let i = 0; i < MachineList.length; i++) {
              if(indexesToPrint.includes(i)) {
                accept_list.push(MachineList[i].id);
              }
            }
            downloadMachineBarcode(accept_list)
        }}
        style={{
          marginRight: "24px",
          height: "48px",
          top: "50%",
          display: "block",
          position: "relative",
          transform: "translateY(-50%)",
        }}
      >
        <span style={{marginTop: "23px", fontWeight: "700", color: "green"}}>Download Barcode</span> 
      </IconButton>
    ),
    customToolbar: () => {
      return (
        <>
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
        </>
      );
    },
    print: false,
    download: false,
    searchText: searchValue,
    searchOpen: searchOpen,
  };



  return (
    <React.Fragment>
      <Box position="relative">
        <MuiThemeProvider theme={getMuiTheme()}>
          <div>
            <BreadCrumb routeSegments={[{ name: "MRCs" }]} />
            {
              isLoading ? 

              <MUIDataTable
                title={"MRC List"}
                columns={columns}
                options={options}
                className = {classes.pageContent}
              /> :

              <MUIDataTable
                title={"MRC List"}
                data={MachineList}
                columns={columns}
                options={options}
                className = {classes.pageContent}
              />
            }
            <TableCell
              className= {classes.MuiTableCell}
            />
            <Popup
              title="MRC Form"
              openPopup={openPopup}
              setOpenPopup={setOpenPopup}
            >
              <MachineForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} MachineList={MachineList}/>
            </Popup>
            <Notification notify={notify} setNotify={setNotify} />
          </div>
        </MuiThemeProvider>
      </Box>
    </React.Fragment>
  );
}

export default MRC;
