/* eslint-disable no-undef */

const mediaRecorderComponent = () => {

    const initRecorderSetup = ({ audioContext, maxDuration }) => {
      // Enable shadows in the renderer.
        // const threejsAudioContext = THREE.AudioContext.getContext()
        console.log("initRecorderSetup");
        XR8.MediaRecorder.configure({
            maxDurationMs: maxDuration,
            enableEndCard: false,

            // END CARD RELATED
            // endCardCallToAction: 'Try it at:',
            // shortLink: '8th.io/my-link',

            // audio related
            audioContext: audioContext || null,
            requestMic: XR8.MediaRecorder.RequestMicOptions.AUTO,
            // configureAudioOutput: userConfiguredAudioOutput,
        })

        initEvents()
    }

    const initEvents = () =>{
        console.log("initEvents");
        let button = document.getElementById('recordButton');
        if(!button){
            button = document.createElement('button');
            button.style = `
                position: fixed;
                z-index: 1000;
                transform: translateX(-50%);
                bottom: 30px;
                left: 50%;
                width: 50px;
                height: 50px;
                border: solid 2px rgb(255, 0, 0);
                background: transparent;
                border-radius: 100%;
            `
            document.documentElement.append(button);
        }
        button.addEventListener('mousedown',startRecording)
        // button.addEventListener('mouseup',stopRecording)
    }

    const videoReadyCallback = (result) =>{
        console.log('video result',result);
        let text = document.getElementById('recording_label')
        document.documentElement.removeChild(text);
        const newObjectUrl = URL.createObjectURL( result.videoBlob );
        console.log(result.videoBlob);

        console.log(newObjectUrl);

        const link = document.createElement('a');
        link.href = newObjectUrl;
        link.download = `myvideo_${Date.now().toString()}.mp4`;

        link.style.display = 'none';

        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);
        //  window.dispatchEvent(new CustomEvent('recordercomplete', {detail: result}))
    }

    const handleRecordingBegining = () =>{
        let text = document.createElement('h2');
        text.id ="recording_label"
        text.textContent = 'recording';
        text.style = `
            position: fixed;
            z-index: 1000;
            transform: translateX(-50%);
            bottom: 50%;
            left: 50%;
            width: 50px;
            height: 50px;
            font-size: 30px;
            color: #ff0000;
        `
        document.documentElement.append(text);
    }

    const showLoading = () =>{
        console.log('...loading');
    }

    const errorHandler = (error) =>{
        console.log('error handler',error);
    }

    const onFrameUpdate = ({elapsedTimeMs, maxRecordingMs, ctx}) => {
         // overlay some red text over the video
        //  ctx.fillStyle = 'red'
        //  ctx.font = '50px "Nunito"'
        //  ctx.fillText(`${elapsedTimeMs}/${maxRecordingMs}`, 50, 50)
        //  const timeLeft =  ( 1 - elapsedTimeMs / maxRecordingMs)
        //  // update the progress bar to show how much time is left
        //  progressBar.style.strokeDashoffset = `${100 * timeLeft }`
    }

    const startRecording = () =>{
        XR8.MediaRecorder.recordVideo({
            onVideoReady: (result) => videoReadyCallback(result),
            onStart: () => handleRecordingBegining(),
            onStop: () => showLoading(),
            onError: (error) => errorHandler(error),
            onProcessFrame: onFrameUpdate,
            onFinalizeProgress: ({progress, total}) => {
            console.log('Export is ' + Math.round(progress / total) + '% complete')
            },
        })
    }

    const stopRecording = () =>{
        XR8.MediaRecorder.stopRecording()
    }

    // Return a camera pipeline module that returns a renderer
    return {
      name: 'recordingModule',
      // TODO: THIS NEEDS TO BE AN UPDATE. OR
      onStart: () => {
        initRecorderSetup({ maxDuration: 5000 })  // Add objects set the starting camera position.
      },

    }
  }

export default mediaRecorderComponent;