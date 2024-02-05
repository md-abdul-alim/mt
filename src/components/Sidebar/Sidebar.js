import React, { useState, useEffect } from "react";
import { Drawer, IconButton, List } from "@material-ui/core";
import {
  Home as HomeIcon,
  NotificationsNone as NotificationsIcon,
  FormatSize as TypographyIcon,
  FilterNone as UIElementsIcon,
  BorderAll as TableIcon,
  QuestionAnswer as SupportIcon,
  LibraryBooks as LibraryIcon,
  HelpOutline as FAQIcon,
  ArrowBack as ArrowBackIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  LineStyle as LineStyleIcon, 
  LineWeight as LineWeightIcon,
  AcUnit as AcUnitIcon,
  Transform as TransformIcon,
  ArrowForward as ArrowForwardIcon,
  Download as DownloadIcon
} from "@material-ui/icons";
import SettingsIcon from '@material-ui/icons/Settings';
import AssessmentIcon from '@material-ui/icons/Assessment';
import { useTheme } from "@material-ui/styles";
import { withRouter } from "react-router-dom";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import SidebarLink from "./components/SidebarLink/SidebarLink";
import Dot from "./components/Dot";

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";

const admin = [
  {
    id: 2,
    label: "Units",
    link: "/app/units",
    icon: <AcUnitIcon />,
  },
  {
    id: 3,
    label: "Line",
    link: "/app/line",
    icon: <LineStyleIcon />,
    children: [
      { label: "Production Line Machines", link: "/app/productionLine" },
      { label: "Support Line Machines", link: "/app/supportLine" },
    ],
  },
  {
    id: 4,
    label: "MRC",
    link: "/app/mrc",
    icon: <LineStyleIcon />,
    children: [
      { label: "MRF", link: "/app/mrc" },
    ],
  },
];

const structure_maintenance_coordinate = [
  {
    id: 3,
    label: "Units",
    link: "/app/units",
    icon: <AcUnitIcon />,
  },
  {
    id: 5,
    label: "Line",
    link: "/app/line-task",
    icon: <LibraryIcon />,
    children: [
      { label: "Production Line Machines", link: "/app/productionLine" },
      { label: "Support Line Machines", link: "/app/supportLine" },
    ],
  },
];

const structure_maintenance_head = [
  {
    id: 2,
    label: "Units",
    link: "/app/units",
    icon: <AcUnitIcon />,
  },
  {
    id: 4,
    label: "Line",
    link: "/app/line",
    icon: <LineStyleIcon />,
    children: [
      { label: "Production Line Machines", link: "/app/productionLine" },
      { label: "Support Line Machines", link: "/app/supportLine" },
    ],
  },
];

const structure_ie_head = [
  {
    id: 2,
    label: "Units",
    link: "/app/units",
    icon: <AcUnitIcon />,
  },
  {
    id: 3,
    label: "Line",
    link: "/app/line",
    icon: <LineStyleIcon />,
    children: [
      { label: "Production Line Machines", link: "/app/productionLine" },
      { label: "Support Line Machines", link: "/app/supportLine" },
    ],
  },
];

const structure_store_manager = [
  {
    id: 3,
    label: "Units",
    link: "/app/units",
    icon: <AcUnitIcon />,
  },
];



function Sidebar({ location }) {
  var classes = useStyles();
  var theme = useTheme();

let structure;

const user_type = localStorage.getItem("user_type");
if(user_type === "IE Head"){
  structure = structure_ie_head
}else if(user_type === "Maintenance Head"){
  structure = structure_maintenance_head
}else if(user_type === "Maintenance Coordinate"){
  structure = structure_maintenance_coordinate
}else if(user_type === "Store Manager"){
  structure = structure_store_manager
}else{
  structure = admin
}
  // global
  var { isSidebarOpened } = useLayoutState();
  var layoutDispatch = useLayoutDispatch();

  // local
  var [isPermanent, setPermanent] = useState(true);

  useEffect(function() {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });

  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List className={classes.sidebarList}>
        {structure.map(link => (
          <SidebarLink
            key={link.id}
            location={location}
            isSidebarOpened={isSidebarOpened}
            {...link}
          />
        ))}
      </List>
    </Drawer>
  );

  // ##################################################################
  function handleWindowWidthChange() {
    var windowWidth = window.innerWidth;
    var breakpointWidth = theme.breakpoints.values.md;
    var isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
