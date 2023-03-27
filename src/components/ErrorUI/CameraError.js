import React, { useEffect, useRef, useState } from "react";
import Detect from "../../util/Detect";
import "./CameraError.scss";
import ios_error_message from "../../assets/images/loadingErrors_ios.png";
import android_error_message from "../../assets/images/loadingErrors_android.png";

const CameraError = () => {
  const renderBackground = () => {
    if (Detect.isIOS) {
      return (
        <React.Fragment>
          <img className="bg apple" src="" alt="" />
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <img className="bg android" src="" alt="" />
        </React.Fragment>
      );
    }
  };



  return (
    <div className="CameraError">
      <div className="background">{renderBackground()}</div>
      <div className="content">
        <img
          src={Detect.isIOS ? ios_error_message : android_error_message}
          alt=""
        />
      </div>
    </div>
  );
};

export default CameraError;
