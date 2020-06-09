import React, { Component } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Tabs, Tab } from "react-bootstrap";
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

class Crop extends Component {
  state = {
    src: null,
    crop: {
      aspect: 1,
      width: 50,
      x: 0,
      y: 0
    },
    key: 1,
  };
  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = function(e) {
       // console.log("#######", reader.result, "#######");
      };

      reader.addEventListener("load", () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  onImageLoaded = (image, pixelCrop, e) => {
    this.imageRef = image;
  };

  onCropComplete = (crop, pixelCrop) => {
    this.makeClientCrop(crop, pixelCrop);
  };

  onCropChange = crop => {
    this.setState({ crop });
  };

  async makeClientCrop(crop, pixelCrop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        pixelCrop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageUrl });
    }
  }
  getCroppedImg(image, pixelCrop, fileName) {
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function() {
          const base64data = reader.result;
        //   console.log(base64data);
        };
      }, "image/jpeg");
    });
  }

  handleSelect = key => {
    this.setState({ key });
  };
  responseGoogle = (response) => {
    console.log(response);
    console.log(response.profileObj.email);
    console.log(response.profileObj.name);
    // let api = new ApiHelper();
    // let result = await api.FetchFromServer(
    //   "/",
    //   "user/login",
    //   "POST",
    //   false,
    //   undefined,
    //   action.payload
    // );
    //console.log(response);
  }

  responseFacebook = (response) => {
    console.log(response);
  }

  render() {
    const { crop, croppedImageUrl, src } = this.state;

    return (
      <div className="crop-image">
        <div>
          <input type="file" onChange={this.onSelectFile} />
        </div>
        {src && (
          <ReactCrop
            src={src}
            crop={crop}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
            maxWidth={"50"}
            maxHeight={"50"}
            minWidth={"25"}
            minHeight={"25"}
          />
        )}
        {croppedImageUrl && (
          <img alt="Crop" style={{ maxWidth: "100%" }} src={croppedImageUrl} />
        )}

          <Tabs
              activeKey={this.state.key}
              onSelect={this.handleSelect}
              id="controlled-tab-example"
              className="custom-tab-wrap"
            >
                <Tab eventKey={1} title="Viewed" tabClassName="">
                </Tab>
                <Tab eventKey={2} title="Sold Out, Waiting for Review" tabClassName="">
                </Tab>
                <Tab eventKey={3} title="Purchased, but Not Sold Out" tabClassName="">
                </Tab>
          </Tabs>
          <GoogleLogin
            clientId="1064752081280-p48d82cnvop6chsh85m17p93c4ei1jtg.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
          />
           <FacebookLogin
          appId="791983124564985"
          autoLoad={true}
          fields="name,email,picture"
          icon="fa-facebook"
          callback={this.responseFacebook} />
      </div>
    );
  }
}
export default Crop;