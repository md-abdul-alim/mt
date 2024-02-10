import React, { Fragment } from "react";
import { Icon, makeStyles } from "@material-ui/core";
import { NavLink } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  breadcrumbContent: {
    margin: theme.spacing(2),
  },
}));

const BreadCrumb = ({ routeSegments }) => {
  const classes = useStyles();
  return (
    <div className={`flex flex-middle position-relative ${classes.breadcrumbContent}`}>
      {routeSegments ? (
        <Fragment>
          <h4 className="m-0 pb-2 font-size-16 capitalize text-middle">
            {routeSegments[routeSegments.length - 1]["name"]}
          </h4>
          <h4 className="m-0 pb-2 ml-8 text-hint">|</h4>
        </Fragment>
      ) : null}
      <NavLink to="/">
        <Icon className="text-middle ml-8 mb-1" color="primary">
          home
        </Icon>
      </NavLink>
      {routeSegments
        ? routeSegments.map((route, index) => (
            <Fragment key={index}>
              <Icon className="text-hint">navigate_next</Icon>
              {index !== routeSegments.length - 1 ? (
                <NavLink to={route.path}>
                  <span className="capitalize text-muted">{route.name}</span>
                </NavLink>
              ) : (
                <span className="capitalize text-muted">{route.name}</span>
              )}
            </Fragment>
          ))
        : null}
    </div>
  );
};

export default BreadCrumb;