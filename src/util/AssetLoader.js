// import loadFont from 'load-bmfont'
import {
    EquirectangularReflectionMapping,
    HalfFloatType, LinearFilter,
    TextureLoader,
    WebGLCubeRenderTarget
} from 'three'
import {DRACOLoader} from '../lib/DracoLoader'

import Emitter from './Emitter'
import {ONASSETLOADED, ONASSETSLOADED} from './constants'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {MeshoptDecoder} from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import {EXRLoader} from "three/examples/jsm/loaders/EXRLoader";

// used by textures, could also be used by others
const loaders = {
    exr: EXRLoader,
    hdr: RGBELoader
};

export default class AssetLoader
{

    constructor(renderer)
    {
        this.renderer = renderer

        // this.PMREMGenerator = new PMREMGenerator(this.renderer)

        this.assetsToLoad = 0
        this.assetsLoaded = 0
        this.loaded = false
        this.waitForJSON = false

        this.JSONS = []
        this.images = []
        this.sounds = []
        this.videos = []
        this.textures = []
        this.models = []
        this.fontTextures = []

        this.dracoLoader = new DRACOLoader()
        this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
        console.log(this.dracoLoader);
    }

    load(resources)
    {
        if (this.waitForJSON) {
            if (resources.jsons?.length > 0) {
                this.assetsToLoad += resources.jsons.length
                this.loadJSONS(resources.jsons, () => {
                    const projects = this.JSONS[0].media.projects

                    for (let i = 0; i < projects.length; i++) {
                        const project = projects[i];

                        if (project.type === 'image') {
                            const object = {
                                id: project.id,
                                url: `images/projects/${project.id}/${project.id}.png`
                            }

                            resources.textures.push(object)
                        } else {
                            const object = {
                                id: project.id,
                                url: `videos/projects/${project.id}/${project.id}.mp4`
                            }

                            resources.videos.push(object)
                        }

                    }

                    this._startLoading(resources)
                })
            }
        } else {
            this._startLoading(resources)
        }
    }

    async _startLoading(resources)
    {
        Emitter.on(ONASSETSLOADED, () => {
            this.loaded = true
        })

        // ----------

        if (typeof resources.images !== 'undefined' && resources.images.length > 0) {
            this.assetsToLoad += resources.images.length
        }

        if (typeof resources.textures !== 'undefined' && resources.textures.length > 0) {
            this.assetsToLoad += resources.textures.length
        }

        if (typeof resources.sounds !== 'undefined' && resources.sounds.length > 0) {
            this.assetsToLoad += resources.sounds.length
        }

        if (typeof resources.videos !== 'undefined' && resources.videos.length > 0) {
            this.assetsToLoad += resources.videos.length
        }

        if (typeof resources.models !== 'undefined' && resources.models.length > 0) {
            this.assetsToLoad += resources.models.length
        }

        if (typeof resources.fontTextures !== 'undefined' && resources.fontTextures.length > 0) {
            this.assetsToLoad += resources.fontTextures.length
        }

        // ----------

        if (resources.images?.length > 0) {
            await this.loadImages(resources.images)
        }

        if (resources.textures?.length > 0) {
            await this.loadTextures(resources.textures)
        }

        if (resources.sounds?.length > 0) {
            await this.loadSounds(resources.sounds)
        }

        if (resources.videos?.length > 0) {
            await this.loadVideos(resources.videos)
        }

        if (resources.models?.length > 0) {
            await this.loadModels(resources.models)
        }

        // if (typeof resources.fontTextures !== 'undefined' && resources.fontTextures.length > 0) {
        //   await this.loadFontTextures(resources.fontTextures)
        // }

        // ----------

        if (this.assetsToLoad === 0) Emitter.emit(ONASSETSLOADED, 100)
    }

    // Getters

    getImage(id)
    {
        return this.images.find(image => image.id === id)
    }

    getTexture(id)
    {
        return this.textures.find(texture => texture.id === id)
    }

    getSound(id)
    {
        return this.sounds.find(sound => sound.id === id)
    }

    getVideo(id)
    {
        return this.videos.find(video => video.id === id)
    }

    getModel(id)
    {
        return this.models.find(model => model.id === id)
    }

    getFontTexture(id)
    {
        return this.fontTextures.find(fontTexture => fontTexture.id === id)
    }

    getJSON(id)
    {
        return this.JSONS.find(json => json.id === id)
    }

    async loadImages(images)
    {
        for (let i = 0; i < images.length; i += 1) {

            await this.loadImage(images[i]).then((image) => {

                this.images.push(image)
                this.assetsLoaded += 1

                const percent = (this.assetsLoaded / this.assetsToLoad) * 100
                Emitter.emit(ONASSETLOADED, percent)
                if (percent === 100) setTimeout(() => {
                    Emitter.emit(ONASSETSLOADED, percent)
                })
            }, (err) => {
                console.log(err)
            })

        }
    }

    async loadImage(media)
    {
        return new Promise((resolve, reject) => {
            const image = new Image()
            image.alt = media.description

            image.onload = () => {
                resolve({id: media.id, media: image})
            }

            image.onerror = () => {
                reject(`Erreur lors du chargement de l'image : ${image.src}`)
            }

            image.src = `${media.url}`
        })
    }

    async loadTextures(textures)
    {
        for (let i = 0; i < textures.length; i += 1) {
            await this.loadTexture(textures[i]).then((texture) => {
                this.textures.push(texture)
                this.assetsLoaded += 1

                const percent = (this.assetsLoaded / this.assetsToLoad) * 100
                // console.log(this.assetsToLoad)
                Emitter.emit(ONASSETLOADED, percent)
                if (percent === 100) setTimeout(() => {
                    Emitter.emit(ONASSETSLOADED, percent)
                }, 100)
            }, (err) => {
                console.log(err)
            })

        }
    }

    async loadTexture(media)
    {
        return new Promise((resolve, reject) => {
            const ext = `${media.url}`.split('.').pop();

            const loader = new (loaders[ext] ?? TextureLoader)();
            if (ext === 'hdr')
                loader.dataType = HalfFloatType;

            loader.load(
                `${media.url}`,
                (texture) => {
                    if (ext === 'hdr')
                        texture = this.convertPano(texture);
                    else if (media.init)
                        this.renderer.initTexture(texture);

                    resolve({id: media.id, media: texture});
                },
                (xhr) => {
                    // console.log(`${((xhr.loaded / xhr.total) * 100)} % loaded`)
                },
                (xhr) => {
                    reject(`An error occurred loading texture : ${xhr}`)
                },
            );
        })
    }

    // async loadSounds(sounds) {

    //   for (let i = 0; i < sounds.length; i++) {
    //     await this.loadSound(sounds[i]).then((sound) => {
    //       this.sounds.push(sound)
    //       this.assetsLoaded += 1

    //       const percent = (this.assetsLoaded / this.assetsToLoad) * 100
    //       Emitter.emit(ONASSETLOADED, percent)
    //       if (percent === 100) setTimeout(() => { Emitter.emit(ONASSETSLOADED, percent) })
    //     }, (err) => {
    //       console.log(err)
    //     })
    //   }
    // }

    // async loadSound(media) {
    //   return new Promise((resolve, reject) => {
    //     const sound = AudioController.createSound({
    //       id: media.id,
    //       url: `${media.url}`,
    //       useAnalyser: media.analyser,
    //     })

    //     sound.on('ready', () => {
    //       resolve({ id: media.id, media: sound })
    //     })

    //     sound.on('error', () => {
    //       reject(`Une erreur est survenue lors du chargement du son : ${sound}`)
    //     })
    //   })
    // }

    async loadVideos(videos)
    {
        for (let i = 0; i < videos.length; i += 1) {

            await this.loadVideo(videos[i]).then((video) => {
                this.videos.push(video)
                this.assetsLoaded += 1
                const percent = (this.assetsLoaded / this.assetsToLoad) * 100
                Emitter.emit(ONASSETLOADED, percent)
                if (percent === 100) setTimeout(() => {
                    Emitter.emit(ONASSETSLOADED, percent)
                })
            }, (err) => {
                console.log(err)
            })

        }
    }

    async loadVideo(media)
    {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video')

            video.oncanplaythrough = () => {
                resolve({id: media.id, media: video})
            }

            video.oncanplay = () => {
                resolve({id: media.id, media: video})
            }

            video.onloadedmetadata = () => {
                resolve({id: media.id, media: video})
            }

            video.onloadeddata = () => {
                resolve({id: media.id, media: video})
            }

            const interval = setInterval(() => {
                if (video.readyState === 4) {
                    clearInterval(interval)
                    resolve({id: media.id, media: video})
                }
            }, 100)

            video.onerror = () => {
                reject(`Une erreur est survenue lors du chargement de la video : ${video}`)
            }

            video.src = `${media.url}`

        })
    }

    async loadModels(models)
    {
        for (let i = 0; i < models.length; i += 1) {

            await this.loadModel(models[i]).then((model) => {

                this.models.push(model)
                this.assetsLoaded += 1

                const percent = (this.assetsLoaded / this.assetsToLoad) * 100

                Emitter.emit(ONASSETLOADED, percent)
                if (percent === 100) setTimeout(() => {
                    Emitter.emit(ONASSETSLOADED, percent)
                })
            }, (err) => {
                console.error(err)
            })

        }
    }

    async loadModel(model)
    {

        return new Promise((resolve, reject) => {

            const ext = model.url.split('.').pop();


            switch (ext) {

                case 'obj': {
                    const loader = new OBJLoader();

                    // load a resource
                    loader.load(
                        // resource URL
                        `${model.url}`,
                        // Function when resource is loaded
                        (object) => {

                            resolve({id: model.id, media: object, type: 'obj'});
                        },

                        () => {
                        },
                        () => {
                            reject('An error happened with the model import.');
                        },
                    );
                    break;
                }

                case 'gltf': {
                    const loader = new GLTFLoader();
                    loader.setDRACOLoader(this.dracoLoader);
                    loader.setMeshoptDecoder(MeshoptDecoder);
                    // load a resource
                    loader.load(
                        // resource URL
                        `${model.url}`,
                        // Function when resource is loaded
                        (object) => {
                            resolve({id: model.id, media: object, type: 'gltf'});
                        },

                        () => {
                        },
                        (err) => {
                            console.log(err)
                            reject('An error happened with the model import.');
                        },
                    );
                    break;
                }

                case 'glb': {
                    // load a resource
                    const loader = new GLTFLoader();
                    loader.setMeshoptDecoder(MeshoptDecoder);
                    loader.setDRACOLoader(this.dracoLoader);
                    loader.load(
                        // resource URL
                        `${model.url}`,
                        // Function when resource is loaded
                        (object) => {
                            if (model.init) {
                                object.scene.traverse((child) => {
                                    if (child.material) {
                                        if (child.material.map) this.renderer.initTexture(child.material.map)
                                        if (child.material.roughnessMap) this.renderer.initTexture(child.material.roughnessMap)
                                        if (child.material.normalMap) this.renderer.initTexture(child.material.normalMap)
                                        if (child.material.metalnessMap) this.renderer.initTexture(child.material.metalnessMap)
                                        if (child.material.envMap) this.renderer.initTexture(child.material.envMap)
                                        if (child.material.aoMap) this.renderer.initTexture(child.material.aoMap)
                                        if (child.material.alphaMap) this.renderer.initTexture(child.material.alphaMap)
                                        if (child.material.lightMap) this.renderer.initTexture(child.material.lightMap)
                                    }
                                })
                            }
                            resolve({id: model.id, media: object, type: 'gltf'});
                        },

                        () => {
                        },
                        (err) => {
                            console.log(err)
                            reject('An error happened with the model import.');
                        },
                    );
                    break;
                }

                case 'fbx': {
                    const loader = new FBXLoader();

                    // load a resource
                    loader.load(
                        // resource URL
                        `${model.url}`,
                        // Function when resource is loaded
                        (object) => {
                            resolve({id: model.id, media: object, type: 'fbx'});
                        },

                        () => {
                        },
                        () => {
                            reject('An error happened with the model import.');
                        },
                    );
                    break;
                }

                default: {
                    const loader = new OBJLoader();

                    // load a resource
                    loader.load(
                        // resource URL
                        `${model.url}`,
                        // Function when resource is loaded
                        (object) => {
                            resolve({id: model.id, media: object, type: 'obj'});
                        },

                        () => {
                        },
                        () => {
                            reject('An error happened with the model import.');
                        },
                    );
                }
            }

        });
    }

    loadJSONS(jsons, callback)
    {
        for (let i = 0; i < jsons.length; i += 1) {

            this.loadJSON(jsons[i]).then((json) => {

                this.JSONS.push(json)

                this.jsons.push(json)
                this.assetsLoaded += 1

                if (this.waitForJSON) {
                    callback()
                } else {
                    const percent = (this.assetsLoaded / this.assetsToLoad) * 100
                    Emitter.emit(ONASSETLOADED, percent)

                    if (percent === 100) {
                        setTimeout(() => {
                            Emitter.emit(ONASSETSLOADED, percent)
                        })
                    }
                }
            }, (err) => {
                console.error(err)
            })

        }
    }

    loadJSON(media)
    {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest()
            request.overrideMimeType("application/json")
            request.open('GET', media.url, true)
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == "200") {
                    resolve({id: media.id, media: JSON.parse(request.responseText)})
                }
            }
            request.send(null)
        })
    }

    convertPano(texture)
    {
        texture.mapping = EquirectangularReflectionMapping
        texture.generateMipmaps = true;

        const cube = new WebGLCubeRenderTarget(texture.source.data.height * .5);
        cube.fromEquirectangularTexture(this.renderer, texture);
        texture.dispose();
        return cube.texture;
    }
}