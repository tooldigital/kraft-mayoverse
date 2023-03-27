import { createStore, createHook } from 'react-sweet-state';
import Detect from '../util/Detect';
import {QueryString} from "../util/QueryString";

// const urlParams = new URLSearchParams(window.location.search).get('product');

const Store = createStore({
    // value of the store on initialisation
    initialState: {
        count: 0,
        sectionIndex: 0,
        currentSection: "",
        assestLoaded: false,
        cameraError: false,
        loadingProgress: 0,
        isMobile: Detect.isMobile || QueryString.debug,
        // isOnLocation: new URLSearchParams(window.location.search).get('atStore')?true:false,
        isPortrait: window.matchMedia("(orientation: portrait)").matches,
    },
    // actions that trigger store mutation
    actions: {
        increment: () => ({ setState, getState }) => {
            setState({ count: getState().count + 1, });
        },
        setSectionIndex: (sectionIndex) => ({ setState }) => {
            setState({ sectionIndex });
        },
        setCurrentSection: (currentSection) => ({ setState }) => {
            setState({ currentSection });
        },
        setLoadingProgress: (loadingProgress) => ({ setState }) => {
            setState({ loadingProgress });
        },
        setAssestLoaded: (assestLoaded) => ({ setState }) => {
            setState({ assestLoaded });
        },
        setCameraError: (cameraError) => ({ setState }) => {
            setState({ cameraError });
        },
        setIsPortrait: (isPortrait) => ({ setState }) => {
            setState({ isPortrait });
        },
    },
    // optional, mostly used for easy debugging
    name: 'appState',
});

export const useStore = createHook(Store);