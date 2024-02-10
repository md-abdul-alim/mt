import React, { useState } from 'react';
// import MaterialTable from 'material-table'
import LinearProgress from '@material-ui/core/LinearProgress';
import {Button} from '@material-ui/core';
import XLSX from 'xlsx'
//new start
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));
//new end

const EXTENSIONS = ['xlsx', 'xls', 'csv']
function ExcelUpload({setChangeRecord, uploadApiLink}) {
  const [colDefs, setColDefs] = useState()
  const [data, setData] = useState()
  const [responseMessage, setResponseMessage] = useState("");
  const [uploadErrorStatus, setUploadErrorStatus] = useState("")
  const [upload, setUpload] = useState(false)
  const [fileName, setFileName] = useState("")
  const [errorText, setErrorText] = useState("")
  const [file, setFile] = useState("")
  const [display, setDisplay] = useState(true)
  const [displayFileName, setDisplayFileName] = useState(true)
  const [displayLinearProgress , setDisplayLinearProgress] = useState(false)
  const [displayResponseMessage, setDisplayResponseMessage] = useState(false)
  const [displayError, setDisplayError] = useState(false)

  const classes = useStyles();

  const getExention = (file) => {
    const parts = file.name.split('.')
    const extension = parts[parts.length - 1]
    setErrorText("")
    setFileName(file.name)
    return EXTENSIONS.includes(extension) // return boolean
  }

  const convertToJson = (headers, data) => {
    const rows = []
    data.forEach(row => {
      let rowData = {}
      row.forEach((element, index) => {
        rowData[headers[index]] = element
      })
      rows.push(rowData)

    });
    return rows
  }

  const postExcelData = async (values) => {
    // setUpload(true)
    const requestOptions = {
      headers: {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      },
    };

    try {
      await axios
        .post(`${uploadApiLink}`, values, {
          requestOptions,
        })
        .then((resp) => {
          setUploadErrorStatus("")
          setTimeout(function() {
            setDisplayFileName(false)
            setDisplayResponseMessage(true)
            setDisplayLinearProgress(false)
            setResponseMessage(resp.data.message);
            setUpload(false)
            setDisplay(true)
            setChangeRecord(resp.data)
          }, 1000);
          // setResponseMessage(resp.data.message);
        });
    } catch (error) {
      setResponseMessage("")
      setDisplayFileName(false)
      setDisplayLinearProgress(false)
      setDisplayError(true)
      setUploadErrorStatus("Upload failed! Invalid file data. Try again.")
      setDisplay(true)
    }
  };

  const apiCall = () => {
    setDisplay(false)
    setDisplayLinearProgress(true)
    setDisplayResponseMessage(true)
    setResponseMessage("Don't close this window. Sheet is uploading...")
    importExcel(file)
  }

  const triggerInputFile = (e) => {
    setUploadErrorStatus("")
    setDisplayResponseMessage(false)
    setDisplayFileName(true)
    fileValidation(e)
  }
  const onInputClick = (event) => {
    event.target.value = ''
  }

  const fileValidation = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    if (file) {
      if (getExention(file)) {
        reader.readAsBinaryString(file)
        setFile(file)
        setUpload(true)
      }
      else {
        setFileName("")
        setUploadErrorStatus("")
        setErrorText("Invalid file type, select xlsx,csv file")
        setUpload(false)
      }
    }
  }

  const importExcel = (file) => { 
    const reader = new FileReader()
    reader.onload = (event) => {
      //parse data

      const bstr = event.target.result
      const workBook = XLSX.read(bstr, { type: "binary" })

      //get first sheet
      const workSheetName = workBook.SheetNames[0]
      const workSheet = workBook.Sheets[workSheetName]
      //convert to array
      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 })
      // var res = fileData.split(",");
      const headers = fileData[0]
      const heads = headers.map(head => ({ title: head, field: head }))
      setColDefs(heads)

      //removing header
      fileData.splice(0, 1)


      setData(convertToJson(headers, fileData))
      postExcelData(fileData)
    }
    reader.readAsBinaryString(file)
  }
 
  return (
    <div align='center' style={{"padding": "10px"}}>
      <div className={classes.root} style={{display: display ? 'block' : 'none' }}>
        <h4 align='center'>Import Data from Excel(xlsx), CSV(csv)</h4>
        <Grid container spacing={1} >
        <Grid item md={6} xs={12} sm={12}>
          <label htmlFor="btn-upload">
            <input
              id="btn-upload"
              name="btn-upload"
              style={{ display: 'none' }}
              type="file"
              onChange = {(event)=>{
                triggerInputFile(event)
              }}
              onClick={onInputClick}
              />
            <Button
              className="btn-choose"
              variant="outlined"
              component="span"
              >
              Choose Files
            </Button>
          </label>
          </Grid>
          <Grid item md={6} xs={12} sm={12}>
          <Button
            className="btn-upload"
            color="primary"
            variant="contained"
            component="span"
            disabled={!upload}
            onClick = {apiCall}
            >
            Upload
          </Button>
        </Grid>
        </Grid>
        
        <br></br>
        <div style={{display: displayFileName ? 'block' : 'none' }}>
          <div style={{marginTop: "10px"}}>
            <p style={{fontSize: "15px", margin: "0px"}}>{fileName.length > 0 ? fileName : null}</p>
          </div>
        </div>
        <div style={{color: 'red', marginTop: "10px"}}>
          <p style={{fontSize: "15px", margin: "0px"}}>{errorText.length > 0 ? errorText : null}</p>
        </div>
      </div>
      <div align='center'>
        <div style={{display: displayLinearProgress ? 'block' : 'none' }}>
          <LinearProgress style={{
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
            }}/>
        </div>
        <div style={{display: displayResponseMessage ? 'block' : 'none' }}>
          <div style={{marginTop: "10px"}}>
            <p style={{fontSize: "15px", color: "green", margin: "0px"}}>{responseMessage.length > 0 ? responseMessage : null}</p>
          </div>
        </div>
        <div style={{display: displayError ? 'block' : 'none' }}>
          <div style={{color: 'red', marginTop: "10px"}}>
            <p style={{fontSize: "15px", margin: "0px"}}>{uploadErrorStatus.length > 0 ? uploadErrorStatus : null}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExcelUpload;