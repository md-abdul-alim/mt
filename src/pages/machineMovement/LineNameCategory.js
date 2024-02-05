import React from "react";
import Grid from "@material-ui/core/Grid";
import LineName from "./LineName";
import LineCategories from "./LineCategories";

import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";

function LineNameCategory() {
  var userType = localStorage.getItem('user_type');

  return (
    <div>
      <BreadCrumb routeSegments={[{ name: "Line Name & Category" }]} />

      <Grid container spacing={1}>
        <Grid item md={6} sm={12} xs={12}>
        < LineName/>
        </Grid>
        <Grid item md={6} sm={12} xs={12}>
          <LineCategories />
        </Grid>
      </Grid>
    </div>
  );
}

export default LineNameCategory;
