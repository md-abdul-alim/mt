import React, { useState, useRef, useEffect } from "react";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Popup from "../../../components/Controls/Popup";
import FabricBarcode from "../../../components/Barcode/FabricBarcode";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import {
  Paper,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Box,
} from "@material-ui/core";
import ArrowBackRoundedIcon from "@material-ui/icons/ArrowBackRounded";
import { CenterFocusStrong } from "@material-ui/icons";

function RejectedMachineDetail(props) {
  let machine_id = props.location.state;
  const [machineDetail, setMachineDetail] = useState([]);

  const AxiosHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    },
  }

  async function fetchMachineDetail(id) {
    try {
      await axios
        .get(`/api/machine/detail/${id}/`, AxiosHeader)
        .then((res) => {
          setMachineDetail(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchMachineDetail(machine_id);
  }, [machine_id]);

  const [openPopup, setOpenPopup] = useState(false);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div>
      <BreadCrumb routeSegments={[{ name: "Rejected Machine Details" }]} />
      <Paper
        elevation={3}
        square={false}
        style={{ paddingTop: 6, margin: "16px" }}
      >
        <div
          className="px-4"
          style={{
            marginBottom: "1.25rem",
            alignItems: "center",
            justifyContent: "space-between",
            display: "flex",
          }}
        >
          <Link to="/app/rejected/machines">
            <IconButton>
              <ArrowBackRoundedIcon />
            </IconButton>
          </Link>
          <div>
          <Box mx={1} display="inline-flex">
            <Button
              variant="contained"
              color="primary"
              className="mr-4 py-2"
              style={{marginBottom: "5px"}}
              onClick={() => {
                setOpenPopup(true);
              }}
            >
              Show Barcode
            </Button>
            </Box>
            <Box mx={1} display="inline-flex">
              <Button
                variant="contained"
                color="secondary"
                onClick={handlePrint}
              >
                Print Barcode
              </Button>
            </Box>
          </div>
        </div>
        <div>
          <Grid container alignItems="flex-start" spacing={6}>
            <Grid item md={6} sm={12} xs={12}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Name:</TableCell>
                    <TableCell align="right">
                      {machineDetail.name}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Model No:</TableCell>
                    <TableCell align="right">
                      {machineDetail.model_no}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Parent Unit:</TableCell>
                    <TableCell align="right">{machineDetail.parent_unit_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Current Unit:</TableCell>
                    <TableCell align="right">{machineDetail.current_unit_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Line:</TableCell>
                    <TableCell align="right">
                      {machineDetail.line}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Category:</TableCell>
                    <TableCell align="right">{machineDetail.category_value}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Type:</TableCell>
                    <TableCell align="right">{machineDetail.type_value}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Brand:</TableCell>
                    <TableCell align="right">
                      {machineDetail.brand}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Supplier:</TableCell>
                    <TableCell align="right">
                      {machineDetail.supplier}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Description:</TableCell>
                    <TableCell align="right">
                      {machineDetail.description}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Acquisition Value:</TableCell>
                    <TableCell align="right">{machineDetail.acquisition_value}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Acquisition Date:</TableCell>
                    <TableCell align="right">{machineDetail.acquisition_date_}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <Table>
                <TableBody>
                <TableRow>
                    <TableCell>Warranty Start:</TableCell>
                    <TableCell align="right">
                      {machineDetail.warranty_start_date}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Warranty End:</TableCell>
                    <TableCell align="right">{machineDetail.warranty_end_date}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Warranty Details:</TableCell>
                    <TableCell align="right">{machineDetail.warranty_details}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Status:</TableCell>
                    <TableCell align="right">{machineDetail.status_value}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Factory Serial No:</TableCell>
                    <TableCell align="right">{machineDetail.factory_serial_no}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Manufacture Serial No:</TableCell>
                    <TableCell align="right">{machineDetail.manufacture_serial_no}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Location:</TableCell>
                    <TableCell align="right">{machineDetail.location}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Air Consumption:</TableCell>
                    <TableCell align="right">{machineDetail.air_consumption}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Steam Consumption:</TableCell>
                    <TableCell align="right">{machineDetail.steam_consumption}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Watt Consumption:</TableCell>
                    <TableCell align="right">{machineDetail.watt_consumption}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Start Date:</TableCell>
                    <TableCell align="right">{machineDetail.start_date_}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Remark:</TableCell>
                    <TableCell align="right">{machineDetail.remark}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </div>
      </Paper>
      <Popup title="Barcode" openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <FabricBarcode fabricDetails={machineDetail} />
      </Popup>
      <div style={{ display: "none" }}>
        <FabricBarcode fabricDetails={machineDetail} ref={componentRef} />
      </div>
    </div>
  );
}

export default RejectedMachineDetail;
