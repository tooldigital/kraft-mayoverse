import wavemap from "../assets/textures/wavemap.png";
import distmap from "../assets/textures/distmap.png";
import envmapDaytime from '../assets/textures/hdr/daytime_panorama_specular.hdr';
import envmapSunset from '../assets/textures/hdr/sunset_panorama_specular.hdr';
import envmapNight from '../assets/textures/hdr/night_panorama_specular.hdr';
import envmapDawn from '../assets/textures/hdr/dawn_panorama_specular.hdr';

const RESOURCES = {
  images: [
    // { id: 'twitter', url: 'images/twitter.png', description: 'twitter' },
    // { id: 'smaa-search', url: SMAAEffect.searchImageDataURL, description: '' },
    // { id: 'smaa-area', url: SMAAEffect.areaImageDataURL, description: '' },
    // { id: 'dust', url: 'static/images/warp/dust.png', description: '' },
  ],
  textures: [
    { id: 'wavemap', url: wavemap },
    { id: 'distmap', url: distmap },
    { id: 'envmap/day', url: envmapDaytime },
    { id: 'envmap/sunset', url: envmapSunset },
    { id: 'envmap/night', url: envmapNight },
    { id: 'envmap/dawn', url: envmapDawn },
    // { id: 'uv', url: 'static/textures/uv.jpg' },
    // { id: 'noise-1k', url: 'static/textures/postprocessing/noise-1k.png' },
  ],
  sounds: [
    // { id: 'intro', url: 'audio/intro.mp3', analyser: false },
  ],
  videos: [
    // { id: 'microsoft', url: 'videos/menu/test.mp4' },
  ],
  models: [
    { id: 'hand-r', url: 'model/hand-r-simple.glb', init: true },
    { id: 'doomdoom', url: 'model/doomdoom.glb', init: true },
    { id: 'flower_stem', url: 'model/flower_stem.glb', init: true },
    { id: 'kami_green', url: 'model/kami_green.glb', init: true },
    { id: 'puppet_bag', url: 'model/puppet_bag.glb', init: true },
    // { id: 'cube', url: 'models/cube/cube2.gltf' },
    // { id: 'instance', url: 'models/testinstance/test.gltf' },
  ],
  jsons: [
    // { id: 'projects', url: 'data/projects.json' }
  ],
  fontTextures: [
    // {
    //   id: 'stratos',
    //   json: 'font-textures/stratos/StratosLCWeb-Regular.json',
    //   image: 'font-textures/stratos/msdf.png'
    // },
  ],
  fonts: [
    // { id: 'playfairdisplay' }
  ]
};

export default RESOURCES;