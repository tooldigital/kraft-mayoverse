import { useEffect, useState, useRef } from 'react';
import './UI.scss';
import logo from '../../assets/images/logo.svg';
import CameraError from '../ErrorUI/CameraError';
import Landing from '../Landing/Landing';
import OrientationError from '../ErrorUI/OrientationError';
import Desktop from '../ErrorUI/Desktop';
import Global from '../../util/Global';

import { useStore } from '../../hook/useStore';
import Emitter from '../../util/Emitter';
import { ONCAMERAERROR, ONRESTART } from '../../util/constants';

const UI = () => {
    const el = useRef();
    const index = useRef(0);
    const sections = [
        '',
        'landing',
        'error-camera',
    ]

    const isFirstTime = useRef(true);

    // const [currentSection, setCurrentSection] = useState(sections[0]);
    const [{currentSection,sectionIndex,assestLoaded}, {setCurrentSection, setSectionIndex, setCameraError}] = useStore();

    const renderSection = (sec)=>{
        switch(sec){
            case 'landing':
                return <Landing></Landing>
            case 'error-camera':
                return <CameraError/>;
            default:
        }
    }

    // Debug change of scene with key arrows
    useEffect(() => {
        const changeIndex = (e)=>{
            if(e.keyCode == 39){
                index.current = index.current<sections.length-1?index.current+1:index.current;
                setSectionIndex(index.current )
                setCurrentSection(sections[index.current])
            }else if(e.keyCode == 37){
                index.current = index.current>0?index.current-1:index.current;
                setSectionIndex(index.current )
                setCurrentSection(sections[index.current])
            }

        }
        document.addEventListener('keydown', changeIndex)
        return () =>{
            document.removeEventListener('keydown', changeIndex)
        }
    }, []);

    useEffect(()=>{
        setCurrentSection(sections[sectionIndex])
        // eslint-disable-next-line no-undef
        window.dataLayer?.push({
          'event' : 'screen-visited',
          'eventCategory' : 'ar-events',
          'eventAction' : 'navigate',
          'screenVisited' : sections[sectionIndex]
        })
    },[sectionIndex])

    useEffect(() => {
        //Reset experience to choose new family
        Emitter.on(ONRESTART,()=>{
            isFirstTime.current = true
            setSectionIndex(1);
            window.dataLayer?.push({
                'event' : 'replay',
                'eventCategory' : 'ar-events',
                'eventAction' : 'replay',
            })
        })
        Emitter.on(ONCAMERAERROR, ()=>{
            console.warn('ERROR CAMERA')
            // setSectionIndex(2) //GO TO ERROR PAGE
            setCurrentSection('error-camera')
            setCameraError(true);
            // setAssestLoaded(true)
        });
    }, []);

    useEffect(()=>{
        if(assestLoaded){
            setCurrentSection('landing');
            setSectionIndex(1);
        }
    },[assestLoaded])

    //render
    return (
        <div ref={el} className="UI">
            {renderSection(currentSection)}
            {Global.isMobile?<OrientationError/>:<Desktop/>}
        </div>
    );
}

export default UI;