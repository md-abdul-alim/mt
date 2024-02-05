import React from "react";
import {
  Paper,
  Grid,
  Box,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  rows,
} from "@material-ui/core";
import Image from "material-ui-image";
import Divider from "@material-ui/core/Divider";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const getMuiTheme = () => createMuiTheme({
  overrides: {
    // MUIDataTableToolbar: {
    //   root: {
    //     backgroundColor: "#50d07d",
    //     color: "#fff"
    //   },
    //   icon: {
    //     color: "#fff",
    //     '&:hover': {
    //          color: "#0000ff"
    //      }
    //  },
    // },
    MuiTableCell: {
      root: {  //This can be referred from Material UI API documentation. 
          padding: '0px',
      },
      sizeSmall:{
        padding: "1px 14px",
      }
    },
  },

  typography: {
    "fontFamily": `"Roboto", "Helvetica", "Arial", sans-serif`,
    "fontSize": 12,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500
   }
})
class StyleBarcode extends React.PureComponent {
  render() {
    return (
      <MuiThemeProvider theme={getMuiTheme()}>
        <div style={{display: "inline-flex", width: "220px"}}>
          <Box p={1} width={0.8}>
          <TableContainer component={Paper} variant="outlined" elevation={0} >
            <Table size="small" aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell scope="row" align="left" style={{paddingTop: "10px"}}>
                    Name: {this.props.styleDetails.name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell scope="row" align="left">
                    Wash: {this.props.styleDetails.wash_type_name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell scope="row" align="left">
                    Designer: {this.props.styleDetails.designer_name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell scope="row" align="left">
                    Price: 
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell scope="row" align="left">
                    Remarks: {this.props.styleDetails.remark}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4}>
                    <Image src={this.props.styleDetails.qrcode} aspectRatio="1/1" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          </Box>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default StyleBarcode;
