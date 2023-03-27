import gsap from 'gsap';
import { CustomEase } from 'gsap/all';
import './Landing.scss';
import { useStore } from '../../hook/useStore';
import { SETARPOSITION } from '../../util/constants';
import Emitter from '../../util/Emitter';
import { useEffect, useRef } from 'react';
import Global from '../../util/Global';

const Landing = () => {
    const [{}, {setCurrentSection, setSectionIndex}] = useStore();

    gsap.registerPlugin(CustomEase)
    const customEse = CustomEase.create("custom", "M0,0 C0,0 0.114,0.409 0.147,0.678 0.158,0.771 0.165,0.82 0.178,0.912 0.185,0.957 0.189,0.981 0.198,1.025 0.205,1.056 0.208,1.073 0.217,1.103 0.223,1.126 0.227,1.141 0.236,1.162 0.242,1.175 0.248,1.183 0.256,1.194 0.259,1.198 0.263,1.2 0.268,1.202 0.272,1.204 0.276,1.205 0.28,1.205 0.285,1.204 0.289,1.202 0.293,1.2 0.298,1.197 0.301,1.195 0.305,1.19 0.315,1.18 0.322,1.173 0.33,1.16 0.356,1.122 0.369,1.098 0.395,1.059 0.406,1.042 0.413,1.032 0.427,1.017 0.439,1.003 0.449,0.994 0.463,0.984 0.475,0.975 0.485,0.971 0.499,0.967 0.508,0.964 0.515,0.964 0.524,0.963 0.534,0.963 0.541,0.963 0.552,0.965 0.597,0.975 0.597,0.973 0.64,0.996 0.67,1.012 0.672,1.013 0.7,1.016 0.723,1.017 0.763,1.006 0.788,1.005 0.849,1.004 0.832,1 0.893,0.999 0.935,0.998 1,1 1,1 ")

    const onClick = () =>{
        // setCurrentSection('look-around')
        setSectionIndex(2)

        setTimeout(() => {
            Emitter.emit(SETARPOSITION);
        }, 300);
    }

    useEffect(() => {
        Global.CVEnabled = true;
        // var tl = gsap.timeline();
        // tl.from(pink.current,{duration: 0.8, delay:0, x:-100, opacity:0, ease:customEse}) //pink
        // tl.pause();
        // tl.timeScale(1.3)
        // setTimeout(() => {
        //     tl.play();
        // }, 300);
    }, []);

    return (
        <section className="Landing">
            <div className="group"></div>
        </section>
    );
}

export default Landing;