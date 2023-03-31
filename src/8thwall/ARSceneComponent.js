/* eslint-disable no-undef */
import React, { useEffect, useRef, useState } from "react";
import Global from "../util/Global";
import threejsPipelineModule from "./threejsPipelineModule";
import WebARScene from "./WebARScene";
import Scene3D from "./Stage3D";

import mediaRecorderComponent from "../module/mediaRecord";
import { realtimeReflections } from "../module/realtimeReflections";
import AssetLoader from "../util/AssetLoader";

import Emitter from "../util/Emitter";
import { ONCAMERAERROR, ONASSETSLOADED } from "../util/constants";
import { WebGLRenderer } from "three";
import RESOURCES from "../util/ResourcesManager";

const raf = require("raf");

//TODO: SETUP A HANDLE AND INITIALIZATION OF THE SCENE TO ENABLE 3D
const ARSceneComponent = React.memo(() => {
  const rafHandle = useRef();
  const canvasRef = useRef();
  const debugCVCanvasRef = useRef();
  const xrRef = useRef();
  const [loaded, setLoaded] = useState(false);
  // const handTracking = useRef(MediaPipeSingleton);
  // const isInit = useRef(false);
  const rendererRef = useRef();

  useEffect(() => {
    rendererRef.current = new WebGLRenderer({
      canvas: canvasRef.current,
      // context: GLctx,
      alpha: false,
      antialias: true,
    });

    rendererRef.current.AH_YEAH = 1;

    window.AssetLoader = new AssetLoader(rendererRef.current);
    Emitter.on(ONASSETSLOADED, () => setLoaded(true));
    window.AssetLoader.load(RESOURCES);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    // todo: Refractor this (MotionSensorUI) on a component.
    let hasMotionEvents_ = false;
    const motionListener = () => {
      hasMotionEvents_ = true;
      window.removeEventListener("devicemotion", motionListener);
    };
    window.addEventListener("devicemotion", motionListener);

    const promptUserToChangeBrowserMotionSettings = () => {
      window.removeEventListener("devicemotion", motionListener);

      // Device orientation permissions only need to be requested on iOS.
      if (XR8.XrDevice.deviceEstimate().os !== "iOS") {
        return;
      }

      // Device orientation permissions only need to be requested if they're required.
      if (XR8.XrPermissions) {
        const permissions = XR8.XrPermissions.permissions();
        const requiredPermissions = XR8.requiredPermissions();
        if (
          !requiredPermissions.has(permissions.DEVICE_MOTION) &&
          !requiredPermissions.has(permissions.DEVICE_ORIENTATION)
        ) {
          return;
        }
      }

      Emitter.emit(ONCAMERAERROR);
      XR8.pause();
      XR8.stop();
    };

    if (Global.ARActive) {
      const onxrloaded = () => {
        xrRef.current = window.XR8;
        window.XR8.XrController.configure({
          disableWorldTracking: false, //Global.debugOnDesktop
          imageTargets: [""],
        });

        LandingPage.configure({
          mediaSrc:
            "https://media.giphy.com/media/UIQc7mECaH5nw0Y03Y/giphy.mp4",
        });

        window.XR8.addCameraPipelineModules([
          // Add camera pipeline modules.
          // Existing pipeline modules.
          XR8.CameraPixelArray.pipelineModule(), // provides the camera texture as an array of RGBA for computer vision
          XR8.GlTextureRenderer.pipelineModule(), // Draws the camera feed.
          threejsPipelineModule(rendererRef.current), // Custom Threejs renderer configuration
          XR8.MediaRecorder.pipelineModule(), // 8thwall recording module
          //mediaRecorderComponent(), // recording handler
          realtimeReflections(), // Enables Realtime reflections
          XR8.XrController.pipelineModule(), // Enables SLAM tracking.
          LandingPage.pipelineModule(), // Detects unsupported browsers and gives hints.
          XRExtras.FullWindowCanvas.pipelineModule(), // Modifies the canvas to fill the window.
          XRExtras.Loading.pipelineModule(), // Manages the loading screen on startup.
          XRExtras.RuntimeError.pipelineModule(), // Shows an error image on runtime error.
          WebARScene(), // actual 3D scene
          // ...                                       // extra 3D scenes.

          // Custom handlers for camera permission pipeline, permission, first render, permission denegated
          // todo: make this into a component/module
          {
            name: "customCameraErrorHandle",
            onStart: () => {
              if (hasMotionEvents_ !== true) {
                promptUserToChangeBrowserMotionSettings();
              }
            },
            onCameraStatusChange: ({ status }) => {
              if (status === "hasStream") {
              } else if (status === "hasVideo") {
                // if(!isInit.current){
                //   isInit.current = true
                //   setTimeout(() => {
                //     handTracking.current.init()
                //   }, 300);
                // }
              } else if (status === "failed") {
                Emitter.emit(ONCAMERAERROR);
                console.log(ONCAMERAERROR);
                // dataLayer?.push({
                //   'event' : 'arEvent',
                //   'eventCategory' : 'permissions',
                //   'eventAction' : 'ar',
                //   'eventLabel' : 'cameraAndPhonePermissions__false'
                // })
              }
            },
            onException: (error) => {
              console.log(error);
              if (error.type === "permission") {
                console.log(error.permission);
                if (
                  error.permission === "prompt" ||
                  error.permission ===
                    XR8.XrPermissions.permissions().DEVICE_ORIENTATION
                ) {
                  console.log(2);
                  console.log(ONCAMERAERROR);
                  Emitter.emit(ONCAMERAERROR);
                  // dataLayer?.push({
                  //   'event' : 'arEvent',
                  //   'eventCategory' : 'permissions',
                  //   'eventAction' : 'ar',
                  //   'eventLabel' : 'cameraAndPhonePermissions__false'
                  // })
                  return;
                }
              }
            },
          },
        ]);
        window.XR8.run({ canvas: canvasRef.current, verbose: true }); //use threejs pipeline canvas
      };
      // window.onload = () => { window.XRExtras ? load() : window.addEventListener('xrextrasloaded', load) }
      if (window.XRExtras) {
        XRExtras.Loading.showLoading({ onxrloaded });
        const loadImage = document.getElementById("loadingContainer");
        const AppRoot = document.querySelector(".App");

        if (loadImage) {
          AppRoot.appendChild(loadImage);
        }
      }
    } else {
      // if not mobile then render a desktop version without AR and orbits controllers
      // Add desktop component 3D Scene if needed.
      Scene3D.init({
        alpha: true,
        antialias: true,
        autoClear: true,
        clearColor: 0x000000,
        opacity: 1.0,
        preserveDrawingBuffer: true,
        webgl1: false,
        onResize: true,
        renderer: rendererRef.current,
        canvas: canvasRef.current,
      });

      rendererRef.current.setPixelRatio(window.devicePixelRatio || 1);
      rendererRef.current.shadowMap.enabled = true;
      rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap;

      console.log("Start!");

      rafHandle.current = raf(function tick() {
        Scene3D.preRender();
        // Animation logic
        Scene3D.render();
        raf(tick);
      });
    }

    // Cleanup
    return () => {
      raf.cancel(rafHandle.current);
      // on cleanup stop AR, not needed when starting component from begining.

      // if (Global.ARActive || window.XR8) {
      //   console.log('return',xrRef.current);
      //   xrRef.current.stop()
      //   xrRef.current.clearCameraPipelineModules()
      // }
    };
  }, [loaded]);

  return (
    <React.Fragment>
      <canvas ref={canvasRef} id="camerafeed"></canvas>
    </React.Fragment>
  );
});
export default ARSceneComponent;
