import Global from '../util/Global'
import Emitter from '../util/Emitter';

import {
    BoxBufferGeometry,
    Clock,
    DoubleSide, EquirectangularReflectionMapping,
    Group, HalfFloatType,
    Mesh,
    MeshBasicMaterial,
    OrthographicCamera,
    PerspectiveCamera,
    Scene,
    sRGBEncoding,
    Vector3,
    WebGL1Renderer, WebGLCubeRenderTarget,
    WebGLRenderer,
    WebGLRenderTarget,
} from 'three'

import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"

class Stage3D
{
    constructor()
    {
        this.scenes = [];
        this.renderers = [];
        this.renderTargets = [];
        this.cameras = [];
        this.post = null;
        this.layers = {
            DEFAULT: 0,
            STENCIL: 1,
        }
        this._onResize = this._onResize.bind(this);
        this._onWindowMousemove = this._onWindowMousemove.bind(this);
        // this.camera.position.set(0, 3, 0);
    }

    init({
             alpha = false,
             antialias = false,
             autoClear = true,
             clearColor = 0xff0000,
             opacity = 1,
             preserveDrawingBuffer = false,
             webgl1 = false,
             onResize = !Global.ARActive,
             // world = false,
             canvas,
             context = null,
             scene = null,
             camera = null,
             renderer = null
         } = {})
    {

        // this.world = world
        this.canvas = canvas;
        this.scene = scene || new Scene();
        this.scenes.push({id: 'mainScene', scene: this.scene});

        this.content = new Group();
        this.scene.add(this.content);

        // this.addTestObjects() //temp test

        //
        this.camera = camera || this.addPerspectiveCamera({
            id: 'mainCamera',
            fov: 60.0,
            width: window.innerWidth,
            height: window.innerHeight,
            near: 0.01,
            far: 1000.0,
            onResize: !Global.ARActive
        })

        if (!camera)
            this.camera.position.set(0, 0, 10);
        this.scene.add(this.camera);

        this.renderer = renderer || (webgl1 ? new WebGL1Renderer({
            alpha,
            antialias,
            preserveDrawingBuffer,
            canvas,
            context
        }) : new WebGLRenderer({
            alpha,
            antialias,
            preserveDrawingBuffer,
            canvas,
            context
        }));


        if (!renderer) {
            this.renderer.autoClear = autoClear;
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor(clearColor, opacity);
        }
        this.renderers.push(this.renderer);

        this.renderer.setSize(window.innerWidth, window.innerHeight)
        // this.renderer.shadowMap.enabled = true
        // this.renderer.shadowMap.type = PCFSoftShadowMap

        // this.renderer.shadowMap = true
        // this.renderer.shadowMapSoft = true
        this.renderer.toneMappingExposure = 1
        this.renderer.outputEncoding = sRGBEncoding

        /*const rgbeLoader = new RGBELoader()
        rgbeLoader.setDataType(HalfFloatType)
            .load(envMap, (hdrTexture) => {
                hdrTexture.mapping = EquirectangularReflectionMapping
                hdrTexture.generateMipmaps = true;
                const cube = new WebGLCubeRenderTarget(hdrTexture.source.data.height * .5);
                cube.fromEquirectangularTexture(this.renderer, hdrTexture);
                const envMap = cube.texture
                envMap.encoding = sRGBEncoding

                // this.scene.background = envMap
                this.scene.environment = envMap

                hdrTexture.dispose()
            })*/

        this.time = 0;
        this.delta = 0;

        this.clock = new Clock()

        if (!Global.ARActive) {
            this.controls = new OrbitControls(this.camera, this.getDOMElement());
            this.controls.target.set(0, 0, 0);
        }

        // this.lightController = new LightController({
        //     lights: [
        //         { type: 'ambient', color: 0xffffff, intensity: 0.5, castShadow: false, helper: false },
        //         // { type: 'directional', color: 0xffffff, intensity: 1.2, castShadow: false, helper: false, x: 3.0, y: 10.0, z: 3.0 },
        //         // { type: 'hemisphere', skyColor: 0xffffff, groundColor: 0xd00000, intensity: 1, helper: false, position: new Vector3(-1, 1, 0) },
        //         { type: 'point', color: 0xffffbb, intensity: 1, distance: 100, decay: 2, x: 0, y: 1, z: -4 },
        //         // { type: 'rect', color: 0xffffff, intensity: 1, width: 10, height: 10 },
        //         // { type: 'spot', color: 0xffffff, castShadow: false, intensity: 1, distance: 10, angle: 0.79, penumbra: 0.2, decay: 2 },
        //     ],
        //     scene: this
        // });

        this.composer = null;

        this._addEvents(onResize);
        if (onResize)
            this._onResize()
    }

    _addEvents(onResize)
    {
        if (onResize) Emitter.on(Emitter.ONRESIZE, this._onResize)
        Emitter.on(Emitter.ONMOUSEMOVE, this._onWindowMousemove)
    }

    // Getters / Setters -----------
    getDOMElement()
    {
        return this.renderer.domElement;
    }

    // State --------
    add(obj, scene = null)
    {
        if (!scene) {
            this.content.add(obj);
        } else {
            scene.add(obj);
        }
    }

    addTestObjects()
    {
        let cube = new Mesh(new BoxBufferGeometry(.3, .3, .3), new MeshBasicMaterial({
            color: 'green',
            side: DoubleSide
        }))
        cube.position.z = -10
        cube.name = "debug_cube"
        this.add(cube)
    }

    addAnchor(obj, scene = null)
    {
        if (!scene) {
            this.scene.add(obj);
        } else {
            scene.add(obj);
        }
    }

    remove(obj, scene = null)
    {
        if (!scene) {
            obj.parent?.remove(obj);
        } else {
            scene.remove(obj);
        }
    }

    // addLight(light)
    // {
    //     this.lightController.addLight(light);
    // }

    addScene({id = '', scene = new Scene()} = {})
    {
        this.scenes.push({id, scene});

        return scene;
    }

    getScene(id)
    {
        for (let i = 0; i < this.scenes.length; i++) {
            const scene = this.scenes[i];

            if (scene.id === id) {
                return scene.scene;
            }
        }

        return console.error(`no scene found with the id : ${id}`);
    }

    addRenderer({id = '', renderer = new WebGLRenderer()} = {})
    {
        this.renderers.push({id, renderer});

        return renderer;
    }

    getRenderer(id)
    {
        for (let i = 0; i < this.renderers.length; i++) {
            const renderer = this.renderers[i];

            if (renderer.id === id) {
                return renderer.renderer;
            }
        }

        return console.error(`no renderer found with the id : ${id}`);
    }

    addRenderTarget({
                        id = '',
                        renderTarget = new WebGLRenderTarget()
                    } = {})
    {
        this.renderTargets.push({id, renderTarget});

        return renderTarget;
    }

    getRenderTarget(id)
    {
        for (let i = 0; i < this.renderTargets.length; i++) {
            const renderTarget = this.renderTargets[i];

            if (renderTarget.id === id) {
                return renderTarget.renderTarget;
            }
        }

        return console.error(`no render target found with the id : ${id}`);
    }

    addPerspectiveCamera({
                             id = '',
                             fov = 45,
                             width = window.innerWidth,
                             height = window.innerHeight,
                             near = 0.01,
                             far = 100,
                             onResize = false
                         } = {})
    {
        const camera = new PerspectiveCamera(fov, width / height, near, far)
        this.cameras.push({id, camera, type: 'perspective', onResize});

        return camera;
    }

    addOrthographicCamera({
                              id = '',
                              width = window.innerWidth,
                              height = window.innerHeight,
                              near = 0,
                              far = 100,
                              position = new Vector3(0, 0, 1),
                              onResize = true
                          } = {})
    {
        const camera = new OrthographicCamera(
            width / -2,
            width / 2,
            height / 2,
            height / -2,
            near,
            far
        );
        camera.position.copy(position)
        this.cameras.push({id, camera, type: 'orthographic', onResize});

        return camera;
    }


    getCamera(id)
    {
        for (let i = 0; i < this.cameras.length; i++) {
            const camera = this.cameras[i];

            if (camera.id === id) {
                return camera.camera;
            }
        }

        return console.error(`no camera found with the id : ${id}`)
    }

    addCamera({camera, id, type, onResize} = {})
    {
        this.cameras.push({id, camera, type, onResize});
    }

    setClearColor(color = 0x000000, alpha = 1)
    {
        this.renderer.setClearColor(color, alpha);
    }

    // rankGpu()
    // {
    //     this.GPUTier = getGPUTier({
    //         glContext: this.renderer.getContext(),
    //         mobileBenchmarkPercentages: [0, 50, 40, 10], // (Default) [TIER_0, TIER_1, TIER_2, TIER_3]
    //         desktopBenchmarkPercentages: [0, 50, 40, 10] // (Default) [TIER_0, TIER_1, TIER_2, TIER_3]
    //     }).then((result) => {
    //         if (result.gpu === 'apple m1 max (Apple M1 Max)' || result.gpu === 'apple m1 pro (Apple M1 Pro)') {
    //             result.tier = 3
    //         }

    //         Emitter.emit(ONGETGPUTIER, result)
    //         console.log(result)
    //     })
    // }

    updateCamera({
                     near = this.config.near.value,
                     far = this.config.far.value,
                     width = window.innerWidth,
                     height = window.innerHeight,
                 } = {})
    {
        this.config.near.value = near
        this.config.far.value = far

        this.camera.far = far
        this.camera.near = near

        this.resize(width, height)
    }


    resize(width, height)
    {
        if (!Global.ARActive) {
            for (let i = 0; i < this.cameras.length; i++) {
                const camera = this.cameras[i];

                if (camera.onResize) {
                    if (camera.type === 'perspective') {
                        camera.camera.aspect = width / height;
                        camera.camera.updateProjectionMatrix();
                    } else {
                        camera.camera.left = width / -2;
                        camera.camera.right = width / 2;
                        camera.camera.top = height / 2;
                        camera.camera.bottom = height / -2;
                        camera.camera.updateProjectionMatrix();
                    }
                }
            }
        }

        this.renderer.setSize(width, height);
    }

    // Events----------
    _onResize()
    {
        const vw = window.innerWidth
        const vh = window.innerHeight
        this.resize(vw, vh);
    }

    _onWindowMousemove(event)
    {

    }

    // Update ---------

    preRender()
    {
        this.delta = Math.min(this.clock.getDelta(), 0.1)
        this.time = this.clock.getElapsedTime()
    }

    render()
    {
        this.renderer.setRenderTarget(null);

        this.controls?.update();

        // this.renderer.clearDepth()
        // if (needsPrerenderFinish) {
        //     this.renderer.getContext().finish()
        // }

        if (this.post)
            this.post.render();
        else
            this.renderer.render(this.scene, this.camera);
    }
}

window.Stage3D = new Stage3D()

export default window.Stage3D