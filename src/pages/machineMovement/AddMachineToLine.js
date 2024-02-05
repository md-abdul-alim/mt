import React, { useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import MUIDataTable from "mui-datatables";
import EditIcon from "@material-ui/icons/Edit";
import axios from "axios";
import IconButton from "@material-ui/core/IconButton";
import FormDialog from "../../components/FormDialog/FormDialog";
import Popup from "../../components/Controls/Popup";
import Notification from "../../components/SnackBar/Notification";
import { makeStyles, Tooltip } from "@material-ui/core";
import AddMachineToLineForm from "./productionLine/AddMachineToLineForm";
import AddMachineToLineByBarcodeForm from "./productionLine/AddMachineToLineByBarcodeForm";
import BarcodeScanner from "../../components/Barcode/BarcodeScanner";
import FullScreenPopup from "../../components/FullScreenPopup/FullScreenPopup";
import CropFreeIcon from '@material-ui/icons/CropFree';

const useStyles = makeStyles((theme) => ({
  pageContent: {
    marginLeft: theme.spacing(2),
    padding: theme.spacing(3),
  },
}));

export default function AddMachineToLine() {
  const classes = useStyles();
  const [addMachineToLineList, setAddMachineToLineList] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [compositionRecord, setCompositionRecord] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(null);



  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  async function fetchCompositions() {
    const requestOptions = {
      headers: {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    };

    try {
      await axios
        .get("/api/line/machine/list/", { requestOptions })
        .then((res) => {
          setAddMachineToLineList(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }


  const updateLine = async (values, setSubmitting) => {
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
        .put(`/api/unit/update/`, values, {
          requestOptions,
        })
        .then((resp) => {
          setCompositionRecord(resp.data);
          setSubmitting(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    fetchCompositions();
  }, [compositionRecord]);

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
      name: "line_name",
      label: "Lines",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "machine_name",
      label: "Machines",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "parent_unit_name",
      label: "Parent Units",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "current_unit_name",
      label: "Current Units",
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
                  openInPopup(item);
                }}
              >
                <EditIcon fontSize="medium" />
              </IconButton>
            </>
          );
        },
      },
    },
  ];

  const addOrEdit = (composition, resetForm, setSubmitting) => {
    if (composition.id === 0) updateLine(composition, setSubmitting);
    else updateLine(composition, setSubmitting);
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
    setOpenPopup2(false);
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
    <div>
      <MUIDataTable
        title={"Machine List Per Unit"}
        data={addMachineToLineList}
        columns={columns}
        options={options}
        className={classes.pageContent}
      />
      <FormDialog
        title="Add Machine to Line Form"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        maxWidth="xs"
      >
        <AddMachineToLineForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} addMachineToLineList={addMachineToLineList} />
      </FormDialog>
      <Popup
        title="Add Machine To Line By Barcode Scan"
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <AddMachineToLineByBarcodeForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} searchValue={searchValue}/>
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
  );
}
