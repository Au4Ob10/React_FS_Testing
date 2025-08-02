'use client';
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import * as fp from 'fingerpose';
import { MSLGestArray, ASLGestArray } from '../../components/generateSigns';
import { fingerTipsRef } from './landmarkRefs';
// import { useMessageBody } from './messageState';
import {validGestureShape, detectMotionGestures } from './gestureDetection/detectMotionSigns';
import detectStaticSigns from './gestureDetection/detectStaticSigns';

const Demo = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const landmarkDetect = useRef(null);

  const staticLetter = useRef<string | null>('');

  const motionLetter = useRef({
    fingerpose: null,
    final: null
  })

  const [ASLMode, setASLMode] = useState(true)
  const [languageArray, setLanguageArray] = useState(ASLGestArray);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const motionEnabledRef = useRef(false);

  const landmarksRef = useRef(null);
  const fingerTipsRef = useRef({
    indexTip: null,
    pinkyTip: null
  });
  const [messageBody, setMessageBody] = useState('')
  const animationRef = useRef(null)


  const pixelValsRef = useRef(null);

  // const landmarkTips = useRef({
  //   indexTip: null,
  //   pinkyTip: null
  // })

  const [appTitle, setAppTitle] = useState<String | null>(
    'American Sign Language'
  );

  const [subHeading, setSubHeading] = useState('Static');


  // const [messageBody, setMessageBody] = useState('')
  // const { messageBody, setMessageBody } = useContext(messageContext);

  const hand_landmarker_task = '/models/hand_landmarker.task';

  let animationFrameId;
  let videoFrameID;
  const video = videoRef.current;


  useEffect(() => {

    if (ASLMode) {
      setAppTitle('American Sign Language')
      setLanguageArray(ASLGestArray)
    }

    else {
      setAppTitle('Mexican Sign Language')
      setLanguageArray(ASLGestArray)
    }

  }, [ASLMode])


  useEffect(() => {
    motionEnabledRef.current = motionEnabled
  },[motionEnabled])

  

  useEffect(() => {
    const initializeHandDetection = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );
        landmarkDetect.current = await HandLandmarker.createFromOptions(
          vision,
          {
            baseOptions: { modelAssetPath: hand_landmarker_task },
            numHands: 1,
            runningMode: 'VIDEO',
          }
        );
        // detectHands();
      } catch (error) {
        console.error('Error initializing hand detection:', error);
      }
      // animationFrameId = requestAnimationFrame(initializeHandDetection);
      // videoFrameID = video.requestVideoFrameCallback(initializeHandDetection);
    };

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
        await initializeHandDetection();
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    startWebcam();

    return () => {
      if (
        videoRef.current &&
        videoRef.current.srcObject instanceof MediaStream
      ) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }

      if (animationFrameId) {
        video.cancelVideoFrameCallback(videoFrameID);
        // cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  let animationId;

 const rafInterval = (callback, interval) => {
    let start = performance.now();
    const loop = (now) => {
          if (!motionEnabledRef.current && now - start >= interval) {
        callback();
        start = now;
      }

      if (motionEnabledRef.current ) {
          staticLetter.current = null;
        cancelAnimationFrame(animationRef.current)
     
        // animationRef.current = null;
      }

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {

    const detectLandmarks = () => {
  if (videoRef.current && videoRef.current.readyState === 4) {
    const handLandmarker = landmarkDetect.current;
        const results = handLandmarker.detectForVideo(
          videoRef.current,
          performance.now()
        );

         landmarksRef.current = results.landmarks[0];


          if (landmarksRef.current && landmarksRef.current.length > 0) {


        const canvas = canvasRef.current;
        const canvasWidth = canvas.clientWidth;
        const canvasHeight = canvas.clientHeight;

          const pixelVals = landmarksRef.current.map(({ x, y, z }) => [
            x * canvasWidth,
            y * canvasHeight,
            z,
          ]);

          pixelValsRef.current = pixelVals;

            fingerTipsRef.current = {
            indexTip: landmarksRef.current[8],
            pinkyTip: landmarksRef.current[20],
          };
      
        }
    }
  }

  

const motionSigns = () => {
detectLandmarks()
  validGestureShape(pixelValsRef,motionLetter)

console.log(motionLetter.current)
  detectMotionGestures(fingerTipsRef,motionLetter,motionEnabled)
  

  let finalLetter = motionLetter.current.final

if (finalLetter && finalLetter.length === 1) {
 setMessageBody((msg) => msg + finalLetter)
 finalLetter = null
}

}
        motionSigns()


    const staticSigns = async () => {
      
      if (!videoRef.current || !canvasRef.current) {
        // requestAnimationFrame(staticSigns);
        return;
      }
          staticLetter.current = detectStaticSigns(languageArray, pixelValsRef)

          if (landmarksRef.current) {

          if (staticLetter.current && staticLetter.current.length === 1) {
            setMessageBody((msg) => msg + staticLetter.current)
            staticLetter.current = ''
           
          }

        }
    }
  //  rafInterval(staticSigns, 500)

    return () => cancelAnimationFrame(animationFrameId);
  }, []);



  const gestureModeToggle = () => {
    setMotionEnabled((useMotion) => !useMotion);
    subHeading === 'Static' ? setSubHeading('Motion') : setSubHeading('Static');
  };

  const gestureLanguageToggle = () => {
    setASLMode((useASL) => !useASL)
  };
  //   const messageBody = useMessageBody((state) => state.messageBody)

  // const setMessage = useMessageBody((state) => state.appendMessage);

  // const clearMessage = () => {
  //   setMessage('')
  //   console.log(messageBody.length)
  // }


  
  const clearMessage = () => {
    setMessageBody('')
  }


  return (
    <>
      {/* 
      <button
        onClick={() => {
          // jRecognize();
        }}
      
        Detect Hand
      </button> */}
      <h1 style={{ textAlign: 'center' }}>{appTitle}</h1>
      <h2 style={{ textAlign: 'center' }}>
        {subHeading} Gesture Detection Enabled
      </h2>
      <button onClick={gestureLanguageToggle}>Toggle Language</button>
      <button onClick={gestureModeToggle}>Toggle Gesture Mode</button>
      <button onClick={clearMessage}>Clear Message</button>
      {/* <button onClick={deleteCharacter}>Backspace</button> */}

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            height: '500px',
            width: '500px',
            // top: 0,
            // left: 0,
            // zIndex: 1,
            transform: 'scaleX(-1)',
            pointerEvents: 'none',
          }}
        />
      </div>

      <p style={{ textAlign: 'center', wordWrap: 'break-word' }}>
        {messageBody}
      </p>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          top: 0,
          left: 0,
          zIndex: 2,
          transform: 'scaleX(-1)',
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

export default Demo;
