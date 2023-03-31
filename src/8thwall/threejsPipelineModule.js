import * as THREE from "three";
import Scene3D from "./Stage3D";
import Emitter from "../util/Emitter";
import { ONASSETSLOADED } from "../util/constants";
window.THREE = THREE;

const threejsPipelineModule = (renderer) => {
  let scene3;
  let engaged = false;

  const engage = ({ canvas, canvasWidth, canvasHeight, GLctx }) => {
    if (engaged) {
      return;
    }

    const camera = new THREE.PerspectiveCamera(
      60.0 /* initial field of view; will get set based on device info later. */,
      canvasWidth / canvasHeight,
      0.01,
      1000.0
    ); //replace with camera from scene object

    renderer.autoClear = false;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;

    // Emitter.on(ONASSETSLOADED, () =>
    Scene3D.init({
      canvas,
      camera,
      renderer,
      // context: GLctx,
      alpha: true,
      antialias: false, // we're using post-processing, don't use anti-aliasing!
      autoClear: false, // can't clear or we hide the cam
      clearColor: 0x000000,
      opacity: 0,
      // preserveDrawingBuffer: false,
      // webgl1: false,
      onResize: false, // everything handled by XR8
    });
    // );

    scene3 = Scene3D;
    engaged = true;
  };

  window.XR8.Threejs.xrScene = () => {
    return scene3;
  };

  return {
    name: "customthreejs",
    onStart: (args) => engage(args),
    onAttach: (args) => engage(args),
    onDetach: () => {
      engaged = false;
    },
    onUpdate: ({ processCpuResult }) => {
      const realitySource =
        processCpuResult.reality ||
        processCpuResult.facecontroller ||
        processCpuResult.layerscontroller;

      if (!realitySource) {
        return;
      }

      const { rotation, position, intrinsics } = realitySource;
      const { camera } = scene3;

      for (let i = 0; i < 16; i++) {
        camera.projectionMatrix.elements[i] = intrinsics[i];
      }

      // Fix for broken raycasting in r103 and higher. Related to:
      //   https://github.com/mrdoob/three.js/pull/15996
      // Note: camera.projectionMatrixInverse wasn't introduced until r96 so check before setting
      // the inverse
      if (camera.projectionMatrixInverse) {
        if (camera.projectionMatrixInverse.invert) {
          // THREE 123 preferred version
          camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
        } else {
          // Backwards compatible version
          camera.projectionMatrixInverse.getInverse(camera.projectionMatrix);
        }
      }

      if (rotation) {
        camera.setRotationFromQuaternion(rotation);
      }
      if (position) {
        camera.position.set(position.x, position.y, position.z);
      }
    },
    onCanvasSizeChange: ({ canvasWidth, canvasHeight }) => {
      if (!engaged) {
        return;
      }
      const { renderer } = scene3;
      renderer.setSize(canvasWidth, canvasHeight);
    },
    onRender: () => {
      Scene3D.render();
    },
    // Get a handle to the xr scene, camera and renderer. Returns:
    // {
    //   scene: The Threejs scene.
    //   camera: The Threejs main camera.
    //   renderer: The Threejs renderer.
    // }
    xrScene: () => {
      return scene3;
    },
  };
};

export default threejsPipelineModule;
