import React from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import classnames from "classnames";


// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Footer from "../Footer/Footer";
import Sidebar from "../Sidebar";

// pages
import Dashboard from "../../pages/dashboard";
import Machines from "../../pages/machines/Machines";
import RejectedMachines from "../../pages/machines/rejectedMachine/RejectedMachines";
import AddMachineToLine from "../../pages/machineMovement/AddMachineToLine";
import ProductionLine from "../../pages/machineMovement/productionLine/ProductionLine";
import SupportLine from "../../pages/machineMovement/supportLine/SupportLine"
import LineName from "../../pages/machineMovement/LineName";
import MachineDetail from "../../pages/machines/MachineDetail";
import RejectedMachineDetail from "../../pages/machines/rejectedMachine/RejectedMachineDetail";
import Units from "../../pages/units/Units";
import UnitForm from "../../pages/units/UnitForm"
import Typography from "../../pages/typography";
import Notifications from "../../pages/notifications";
import Maps from "../../pages/maps";
import Tables from "../../pages/tables";
import Icons from "../../pages/icons";
import Charts from "../../pages/charts";
import Profile from "../../pages/profile/Profile";
import MachineRentCategoryType from "../../pages/machines/MachineRentCategoryType";
import LineNameCategory from "../../pages/machineMovement/LineNameCategory";

//Transfer

//MRC
import MRC from "../../pages/MRC/MRC";
import MRCTable from "../../pages/MRC/MRCTable";

// context
import { useLayoutState } from "../../context/LayoutContext";

function Layout(props) {
  var classes = useStyles();

  // global
  var layoutState = useLayoutState();

  return (
    <div className={classes.root}>
      <>
        <Header history={props.history} />
        <Sidebar />
        <div
          className={classnames(classes.content, {
            [classes.contentShift]: layoutState.isSidebarOpened,
          })}
        >
          <div className={classes.fakeToolbar} />
          <div>
          <Switch>
            <Route path="/app/dashboard" component={Dashboard} />
            <Route path="/app/machines" component={Machines} />
            <Route path="/app/rejected/machines" component={RejectedMachines} />
            {/* <Route path="/app/AddMachineToLine" component={AddMachineToLine} /> */} 
            <Route path="/app/line" component={ProductionLine} />
            <Route path="/app/productionLine" component={ProductionLine} />
            <Route path="/app/supportLine" component={SupportLine} />
            <Route path="/app/line-name" component={LineName} />
            <Route path="/app/machine/details" component={MachineDetail} />
            <Route path="/app/rejected/machine/details" component={RejectedMachineDetail} />
            <Route path="/app/units" component={Units} />
            <Route path="/app/unit/form" component={UnitForm}/>
            <Route path="/app/typography" component={Typography} />
            <Route path="/app/tables" component={Tables} />
            <Route path="/app/notifications" component={Notifications} />
            <Route path="/app/profile" component={Profile} />
            <Route path="/app/machine/rentCategoriesTypes" component={MachineRentCategoryType} />
            <Route path="/app/linECategoryName" component={LineNameCategory} />
            <Route exact path="/app/ui" render={() => <Redirect to="/app/ui/icons" />} />
            {/* Transfer */}


            {/* MRC */}
            <Route path="/app/mrc" component={MRC} />
            <Route path="/app/mrc-table" component={MRCTable} />

            <Route path="/app/ui/maps" component={Maps} />
            <Route path="/app/ui/icons" component={Icons} />
            <Route path="/app/ui/charts" component={Charts} />
          </Switch>
          <Footer />
          </div>
        </div>
      </>
    </div>
  );
}

export default withRouter(Layout);
