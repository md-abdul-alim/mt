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
        <div style={{display: "inline-flex", width: "240px"}}>
          <Box p={1} width={1}>
          <TableContainer component={Paper} variant="outlined" elevation={0} >
            <Table size="small" aria-label="simple table">
              <TableBody>
                  <Image src={this.props.fabricDetails.barcode} aspectRatio="1/3" />
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
