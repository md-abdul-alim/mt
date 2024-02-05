import React from "react";
import Grid from "@material-ui/core/Grid";
import MachineTypes from "./MachineTypes";
import MachineCategories from "./MachineCategories";
import MachineRent from './MachineRent';
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";

function MachineRentCategoryType() {
  var userType = localStorage.getItem('user_type');

  return (
    <div>
      <BreadCrumb routeSegments={[{ name: "Machine Rent, Type & Category" }]} />

      <Grid container spacing={1}>
        <Grid item md={4} sm={12} xs={12}>
          <MachineTypes />
        </Grid>
        <Grid item md={4} sm={12} xs={12}>
          <MachineCategories/>
        </Grid>
        <Grid item md={4} sm={12} xs={12}>
          <MachineRent/>
        </Grid>
      </Grid>
    </div>
  );
}

export default MachineRentCategoryType;
