import React, { useState, useEffect } from "react";
import clsx from "clsx";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import UploadIcon from "@material-ui/icons/CloudUpload";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import MUIDataTable from "mui-datatables";
import EditIcon from "@material-ui/icons/Edit";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import CropFreeIcon from "@material-ui/icons/CropFree";
import CloseIcon from "@material-ui/icons/Close";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import { Box } from "@material-ui/core";
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
import MRCForm from "./MRCForm";

import { makeStyles, TableCell, Tooltip } from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

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
    "&:hover": {
      color: "#0000ff",
    },
  },
}));

function MRC() {
  const classes = useStyles();
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

  const user_type = localStorage.getItem("user_type");
  const unit = localStorage.getItem("unit");

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
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  };

  async function fetchMachines() {
    setIsLoading(true);
    try {
      await axios
        .get(`/api/style-wise-machine-list-by-unit/`, AxiosHeader)
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

  async function fetchStyleWiseMachineDetail(id) {
    setIsLoading(true);
    try {
      await axios
        .get(`/api/style-wise-machine-details/${id}/`, AxiosHeader)
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

  const postStyleWiseMachine = async (values, setSubmitting) => {
    console.log("create: ", values);
    try {
      await axios
        .post("/api/style-wise-machines-create/", values, AxiosHeader)
        .then((resp) => {
          setFabricRecord(resp.data);
          // alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateStyleWiseMachine = async (values, setSubmitting) => {
    console.log("Updated data: ", values)
    try {
      await axios
        .put(
          `/api/style-wise-machines-update/${values.id}/`,
          values,
          AxiosHeader
        )
        .then((resp) => {
          setFabricRecord(resp.data);
          // alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    fetchMachineList();
    fetchMachines();
  }, [fabricRecord, searchOpen]);

  const openInPopup = (item) => {
    fetchStyleWiseMachineDetail(item.id);
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
      name: "style",
      label: "Style",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "unit_name",
      label: "Unit Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "plant_name",
      label: "Plant Unit",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "buyer_name",
      label: "Buyer Name",
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
                  if (
                    (item.parent_unit_name === unit &&
                      user_type === "Maintenance Head") ||
                    (item.parent_unit_name === unit &&
                      user_type === "Maintenance Coordinate") ||
                    (item.parent_unit_name === unit &&
                      user_type === "IE Head") ||
                    user_type === "Admin"
                  ) {
                    openInPopup(item);
                  } else {
                    alert("You have no update permission");
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

  const addOrEdit = (style, resetForm, setSubmitting) => {
    console.log("data: ", style);
    if (style.id == 0) postStyleWiseMachine(style, setSubmitting);
    else updateStyleWiseMachine(style, setSubmitting);
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
    rowsPerPageOptions: [20, 50, 100, 200],
    customToolbar: () => {
      return (
        <>
          <Tooltip title={"Add New"}>
            <IconButton
              className={classes.iconButtonColor}
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
            {isLoading ? (
              <MUIDataTable
                title={"MRC List"}
                columns={columns}
                options={options}
                className={classes.pageContent}
              />
            ) : (
              <MUIDataTable
                title={"MRC List"}
                data={MachineList}
                columns={columns}
                options={options}
                className={classes.pageContent}
              />
            )}
            <TableCell className={classes.MuiTableCell} />
            <Popup
              title="MRC Form"
              width="xl"
              openPopup={openPopup}
              setOpenPopup={setOpenPopup}
            >
              <MRCForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
            </Popup>
            <Notification notify={notify} setNotify={setNotify} />
          </div>
        </MuiThemeProvider>
      </Box>
    </React.Fragment>
  );
}

export default MRC;
