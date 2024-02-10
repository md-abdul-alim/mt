import React from "react";
import Grid from "@material-ui/core/Grid";
import ProfileUpdateForm from "./ProfileUpdateForm";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";

function Profile() {
  return (
    <div>
      <BreadCrumb routeSegments={[{ name: "Profile" }]} />
          <Grid container spacing={1}>
                <Grid item md={4} sm={3} xs={12}></Grid>
                <Grid item md={4} sm={6} xs={12}>
                    <ProfileUpdateForm />
                </Grid>
                <Grid item md={4} sm={3} xs={12}></Grid>
            </Grid>
      {/* <Grid container justify="space-between" spacing={1}>
          <ProfileUpdateForm />
      </Grid> */}
    </div>
  );
}

export default Profile;
