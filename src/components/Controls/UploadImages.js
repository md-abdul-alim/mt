import React, { Component } from "react";
import { Button, Grid } from '@material-ui/core';

export default class UploadImages extends Component {
  constructor(props) {
    super(props);
    this.selectFile = this.selectFile.bind(this);

    this.state = {
      currentFile: undefined,
      previewImage: undefined,
    };
  }


  selectFile(event) {
    this.setState({
      currentFile: event.target.files[0],
      previewImage: URL.createObjectURL(event.target.files[0]),
    });
  }


  render() {
    const { currentFile, previewImage } = this.state;

    return (
      <div className="mg20">
        <Grid container spacing={2}>
          <Grid justify="flex-start" item md={12} sm={12} xs={12}>
            <label htmlFor="btn-upload">
              <input
                id="btn-upload"
                name={this.props.name}
                style={{ display: 'none' }}
                value={this.props.value}
                type={this.props.type}
                accept={this.props.accept}
                onChange={this.selectFile} 
                
              />
                <Grid  alignItems="center" container spacing={2}>
                  <Grid item md={7} sm={12} xs={12}>
                    <Button
                      className="btn-choose"
                      variant="outlined"
                      // onClick={this.upload}
                      component="span" >
                      Choose Image
                    </Button>
                  </Grid>
                  <Grid item md={5} sm={12} xs={12}>
                      <div className="file-name">
                        {currentFile ? currentFile.name : null}
                      </div>
                  </Grid>
                </Grid>
            </label>
          </Grid>
          <Grid align='center' item md={12} sm={12} xs={12} >
            {previewImage && (
              <div> {/*style={{backgroundColor: "red"}}*/}
                <img className="preview my20" src={previewImage} alt="Style Image"  height="60%" width="60%" />
              </div>
            )}
          </Grid>
        </Grid>
      </div >
    );
  }
}