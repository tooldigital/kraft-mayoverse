import { useEffect, useState, useRef } from 'react';
import { useStore } from '../../hook/useStore';

import rotate_art from '../../assets/images/rotate-image.png';
import logo from '../../assets/images/logo.svg';

import './OrientationError.scss'
const OrientationError = () => {
    const [{isPortrait},{setIsPortrait}] = useStore();
    const orientationRef = useRef();
    // Detect screen orientation and display error
    useEffect(() => {
        orientationRef.current = window.matchMedia("(orientation: portrait)")
        console.log(orientationRef.current);
        const handleOrientation = (e)=>{
            if(e.matches) {
                // Portrait mode
                setIsPortrait(true);
            } else {
                // Landscape
                setIsPortrait(false);
            }
        }
        orientationRef.current?.addEventListener("change", handleOrientation)

        return ()=>{
            orientationRef.current?.removeEventListener("change", handleOrientation)
        }

    }, []);
    return (
        <section className={`OrientationError ${isPortrait?'':'show'}`}>

            <div className='content'>
                <div className="left-block block">
                    <img className="logo" src={logo} alt="" />
                    <span className="copy">
                        <p>ROTATE</p>
                        <p>YOUR</p>
                        <p>DEVICE!</p>
                        <p className='fine_print'>experience NOT SUPPORTED ON LANDSCAPE</p>
                    </span>
                </div>
                <div className="right-block block">
                    <img src={rotate_art} alt="" />
                </div>
            </div>
        </section>
    );
}

export default OrientationError;