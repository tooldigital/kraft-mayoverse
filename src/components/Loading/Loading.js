import './Loading.scss';
// import { ReactComponent as LoadingBar } from './loading_bar.svg';

import logo8thwall from "../../assets/images/8th_Wall_Logo.png";

import LoadingBar from './LoadingBar';
import { useEffect, useRef, useState } from 'react';
import Emitter from '../../util/Emitter';
import { ONASSETSLOADED } from '../../util/constants';
import { useStore } from '../../hook/useStore';
import gsap from 'gsap';
import { CustomEase } from 'gsap/all';

const Loading = () => {
    const [{assestLoaded,cameraError, isPortrait},{setAssestLoaded}] = useStore();
    const [count, setCount] = useState(0);
    const intervalRef = useRef(0);
    const tweenRef = useRef();

    const loadingBarRef = useRef();

    gsap.registerPlugin(CustomEase)
    const customEseLimited =  CustomEase.create("custom", "M0,0 C0,0 0.045,0.204 0.078,0.474 0.089,0.567 0.096,0.615 0.11,0.708 0.116,0.752 0.121,0.776 0.13,0.821 0.136,0.851 0.139,0.869 0.148,0.898 0.154,0.921 0.159,0.935 0.168,0.956 0.174,0.969 0.18,0.978 0.188,0.989 0.191,0.993 0.195,0.995 0.2,0.997 0.203,0.999 0.208,1 0.212,0.999 0.216,0.999 0.22,0.997 0.225,0.995 0.229,0.992 0.233,0.99 0.237,0.985 0.247,0.975 0.268,0.78 0.322,0.78 0.408,0.78 0.424,0.982 0.472,0.982 0.522,0.982 0.512,0.882 0.546,0.882 0.576,0.882 0.57,0.914 0.59,0.944 0.611,0.976 0.611,1 0.66,1 0.701,1 0.776,0.991 0.8,0.99 0.861,0.989 1,1 1,1 ")
    const customEse = CustomEase.create("custom", "M0,0 C0,0 0.114,0.409 0.147,0.678 0.158,0.771 0.165,0.82 0.178,0.912 0.185,0.957 0.189,0.981 0.198,1.025 0.205,1.056 0.208,1.073 0.217,1.103 0.223,1.126 0.227,1.141 0.236,1.162 0.242,1.175 0.248,1.183 0.256,1.194 0.259,1.198 0.263,1.2 0.268,1.202 0.272,1.204 0.276,1.205 0.28,1.205 0.285,1.204 0.289,1.202 0.293,1.2 0.298,1.197 0.301,1.195 0.305,1.19 0.315,1.18 0.322,1.173 0.33,1.16 0.356,1.122 0.369,1.098 0.395,1.059 0.406,1.042 0.413,1.032 0.427,1.017 0.439,1.003 0.449,0.994 0.463,0.984 0.475,0.975 0.485,0.971 0.499,0.967 0.508,0.964 0.515,0.964 0.524,0.963 0.534,0.963 0.541,0.963 0.552,0.965 0.597,0.975 0.597,0.973 0.64,0.996 0.67,1.012 0.672,1.013 0.7,1.016 0.723,1.017 0.763,1.006 0.788,1.005 0.849,1.004 0.832,1 0.893,0.999 0.935,0.998 1,1 1,1 ")

    const buildupAnimation = () => {
        if(!tweenRef.current){
            tweenRef.current = gsap.timeline({});
            tweenRef.current.from(loadingBarRef.current,{duration: 0.6 ,y:'20px', ease:customEse},0.4)
            tweenRef.current.to(loadingBarRef.current,{duration: 0.6 ,opacity: 1, ease:customEse},0.4)
            tweenRef.current.pause();
        }

        // tweenRef.current.timeScale(1.3)
        tweenRef.current.play();
    }
    useEffect(() => {
        Emitter.on(ONASSETSLOADED,(data)=>{
            console.log("assets loaded",data);
            setAssestLoaded(true)
        })
        buildupAnimation();
    }, []);

    return (
        <div className="Loading" style={{display:`${(assestLoaded||cameraError||!isPortrait)?'none':'flex'}`}}>

            <div className='bg'>
            </div>
            <LoadingBar count={count} ref={loadingBarRef}/>
            <img className='_8thwall_logo' src={logo8thwall} alt="" />
        </div>
    );

}

export default Loading;