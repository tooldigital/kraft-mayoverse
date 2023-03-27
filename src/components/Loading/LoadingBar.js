import { forwardRef, useEffect } from 'react';
import { ONASSETLOADED, ONASSETSLOADED } from '../../util/constants'
import { useStore } from '../../hook/useStore';
import Emitter from '../../util/Emitter';


const LoadingBar =  forwardRef((props,ref) => {

    const [{loadingProgress},{setLoadingProgress}] = useStore();
    useEffect(() => {
        Emitter.on(ONASSETLOADED,(data)=>{
            console.log("loadingData",data);
            setLoadingProgress(data)
        })
    }, []);

    return (
        <div className="LoadingBar" ref={ref}>
            <div className="loading_bar" >
                <img src='' alt="" style={{left: `${loadingProgress}%`, opacity: props.count===0?1:0}} />
            </div>
        </div>


    );
})

export default LoadingBar;