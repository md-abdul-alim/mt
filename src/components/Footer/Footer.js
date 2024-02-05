import React from "react";
import { Box } from "@material-ui/core";
import classnames from "classnames";

// styles
import useStyles from "../Layout/styles";



export default function Footer({ theme }) {
  var classes = useStyles();

  return (
    <Box width={1}>
      <div
        className={`footer flex flex-middle ${classnames(classes.fixedBottom)}`}
      >
        <div className="flex flex-middle container px-sm-30 w-100">
          <a href="https://www.dekkoisho.com/" className="mr-8" target="_blank">
            <span>&copy; 2023 Dekko Isho IT.</span>
          </a>
          {/* <a href="https://ui-lib.com/downloads/matx-pro-react-material-design-admin-template/">
            <Button variant="contained" color="secondary">
              Get MatX Pro
            </Button>
          </a> */}
          <span className="m-auto"></span>
          <p className="m-0">
            Design and Developed by{" "}
            <a href="https://www.linkedin.com/in/md-abdul-alim-milon/" target="_blank">Md. Abdul Alim</a>
          </p>
        </div>
      </div>
    </Box>
  );
}
