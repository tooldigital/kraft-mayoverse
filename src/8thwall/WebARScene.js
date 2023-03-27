// import Postprocessing from './Postprocessing'
// import {autobind} from "core-decorators";
// import {ONASSETSLOADED, ONMARKERFOUND, ONPLAYERREADY, ONSTART} from "../core/constants";
import Emitter from "../util/Emitter";
import * as THREE from 'three'
import {ONCANVASRESIZE} from "../util/constants";

const WebARScene = () => {
    let cube;


    let time = Date.now();
    let _stage3D;

    const initXrScene = (stage3D) => {
        _stage3D = stage3D;
        const { scene, camera, content } = stage3D;


        // Add a random cube in space to test marker //
        cube = new THREE.Mesh(new THREE.BoxBufferGeometry(0.6, 0.6, 0.6), new THREE.MeshStandardMaterial({ color: 'blue', side: THREE.DoubleSide, roughness: 0, metalness: 0 }))
        cube.position.set(0, 0.3, -2)
        cube.castShadow = true

        scene.add(cube);

        // Add basic lightning
        scene.add(new THREE.AmbientLight(0x404040, 0.5))
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(5, 10, 7)
        directionalLight.castShadow = true
        scene.add(directionalLight)

        //add temp floating elements around the user.
        // addFloatingBubbles(scene);

        camera.position.set(0, 2, 0)

        configDebugTool();
    }

    const configDebugTool = () => {
    }

    // Places content over image target
    const showTarget = ({ detail }) => {

        //AR MARKER
        // if (detail.name === 'marker_name') {
        if (detail.name.includes('color_bottle')) {
            cube.position.copy(detail.position)
            cube.quaternion.copy(detail.rotation)
            cube.scale.set(detail.scale, detail.scale, detail.scale)
            if (!cube.visible) {
                // alert('found')
            }
            cube.visible = true

            // Emitter.emit("marker_found", detail.name);
        }
    }


    // Hides the image frame when the target is no longer detected.
    const hideTarget = ({ detail }) => {
        // if (detail.name === 'coke_zs_325ml_flat' || detail.name === 'test-marker') {
        if (detail.name.includes('color_bottle')) {
            cube.position.copy(detail.position)
            cube.quaternion.copy(detail.rotation)
            cube.scale.set(detail.scale, detail.scale, detail.scale)
            if (cube.visible) {
                // Emitter.emit("marker_lost", detail.name);
            }
            cube.visible = false
        }
    }

    // Grab a handle to the threejs scene and set the camera position on pipeline startup.
    const onStart = ({ canvas, GLctx }) => {
        console.log('onstart', window.XR8.Threejs.xrScene());

        const stage3D = window.XR8.Threejs.xrScene();
        const { scene, camera } = stage3D  // Get the 3js scene from XR8.Threejs

        initXrScene(stage3D)  // Add content to the scene and set starting camera position.

        // prevent scroll/pinch gestures on canvas
        canvas.addEventListener('touchmove', (event) => {
            event.preventDefault()
        })

        // Sync the xr controller's 6DoF position and camera paremeters with our scene.
        window.XR8.XrController.updateCameraProjectionMatrix({
            origin: camera.position,
            facing: camera.quaternion,
        })
    }

    const onRender = () => {
    }

    return {
        // Camera pipeline modules need a name. It can be whatever you want but must be
        // unique within your app.
        name: 'general-ar-tracking-scene',

        onStart,
        onRender,
        onCanvasSizeChange: ({ canvasWidth, canvasHeight }) => {
            const stage3D = window.XR8.Threejs.xrScene();
            stage3D.resize(canvasWidth, canvasHeight);
            stage3D.post?.composer?.setSize(canvasWidth, canvasHeight);
            Emitter.emit(ONCANVASRESIZE, { canvasWidth, canvasHeight })
        },

        // Listeners are called right after the processing stage that fired them. This guarantees that
        // updates can be applied at an appropriate synchronized point in the rendering cycle.
        listeners: [
            { event: 'reality.imagefound', process: showTarget },
            { event: 'reality.imageupdated', process: showTarget },
            { event: 'reality.imagelost', process: hideTarget },
        ],
    }
}

export default WebARScene;