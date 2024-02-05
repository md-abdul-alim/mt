import React, { useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import MUIDataTable from "mui-datatables";
import EditIcon from "@material-ui/icons/Edit";
import axios from "axios";
import IconButton from "@material-ui/core/IconButton";
import Popup from "../../components/Controls/Popup";
import Notification from "../../components/SnackBar/Notification";
import { makeStyles, Tooltip } from "@material-ui/core";
import AddMachineToLineForm from "./AddMachineToLineForm";
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

export default function AddMachineToLine() {
  const classes = useStyles();
  const [appearanceList, setAppearanceList] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [appearanceRecord, setAppearanceRecord] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);

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

  async function fetchAppearances() {
    const requestOptions = {
      headers: {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    };

    try {
      await axios
        .get("/api/category/list", { requestOptions })
        .then((res) => {
          setAppearanceList(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  const postAppearance = async (values, setSubmitting) => {
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
        .post("/api/appearance/create/", values, {
          requestOptions,
        })
        .then((resp) => {
          setAppearanceRecord(resp.data);
          setSubmitting(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateAppearance = async (values, setSubmitting) => {
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
        .put(`/api/appearance/update/${values.id}/`, values, {
          requestOptions,
        })
        .then((resp) => {
          setAppearanceRecord(resp.data);
          setSubmitting(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    fetchAppearances();
  }, [appearanceRecord]);

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
          tableMeta.tableData.forEach(function (appearance) {
            if (appearance.id == tableMeta.rowData[0])
              return (item = appearance);
          });
          return (
            <>
              <IconButton
                color="primary"
                onClick={() => {
                  openInPopup(item);
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

  const addOrEdit = (appearance, resetForm, setSubmitting) => {
    if (appearance.id === 0) postAppearance(appearance, setSubmitting);
    else updateAppearance(appearance, setSubmitting);
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
    <MuiThemeProvider theme={getMuiTheme()}>
      <div>

        <BreadCrumb
          routeSegments={[
            { name: "Macines", path: "/app/machine" },
            { name: "Add Machine to Line" },
          ]}
        />
      
        <MUIDataTable
          title={"MachineToLine List"}
          data={appearanceList}
          columns={columns}
          options={options}
          className={classes.pageContent}
        />

        <Popup
          title="MachineToLine Form"
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >

          <AddMachineToLineForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
        </Popup>

        <Notification notify={notify} setNotify={setNotify} />
        
      </div>
    </MuiThemeProvider>
  );
}
