import React from "react";
import {
  Paper,
  Box,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import Image from "material-ui-image";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const getMuiTheme = () => createMuiTheme({
  overrides: {

    MuiTableCell: {
      root: {
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
class SingleBarcode extends React.PureComponent {
  render() {
    return (
      <MuiThemeProvider theme={getMuiTheme()}>
        <div style={{display: "inline-flex"}}>
          <Box p={1} width={0.8}>
          <TableContainer component={Paper} variant="outlined" elevation={0} >
            <Table size="small" aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell scope="row" align="left" style={{paddingTop: "10px", paddingRight: "0px"}}>
                    DI Ref.: {this.props.fabricDetails.dekko_reference}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell scope="row" align="left" style={{paddingRight: "0px"}}>
                    Composition: {this.props.fabricDetails.fabric_composition}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell scope="row" align="left"  style={{paddingRight: "0px"}}>
                    Weight: {this.props.fabricDetails.weight}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4}  style={{paddingRight: "0px"}}>
                    <Image src={this.props.fabricDetails.qrcode} aspectRatio="1/1" />
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

export default SingleBarcode;
