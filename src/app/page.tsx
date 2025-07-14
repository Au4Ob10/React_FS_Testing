'use client';
import React, {
  useState,
  createContext,
  useRef,
  useEffect,
  SetStateAction,
  Dispatch,
  useContext,
  ReactNode,
} from 'react';
import { MSLGestArray, ASLGestArray } from '../../components/generateSigns';
import GestureToggleButton from './gestureDetection/gestureMode';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
// import { useStaticSignsDetect } from './gestureDetection/staticSignsDetect';
import * as fp from 'fingerpose';

import { useMotionSignsDetect } from './gestureDetection/motionSignsDetect';
import { msgBody } from './messageContext';

// export const titleContext = createContext(null)
// export const subheadingContext = createContext(null)

// export const Demo = ({children}: {children: ReactNode }) => {
export const Demo = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // const [messageBody, setMessageBody] = useState<string | null>('');
  const [subheading, setSubheading] = useState('Motion Detection Enabled');
  const [motionDetectionEnabled, setMotionDetectionEnabled] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(MSLGestArray);
  const [appTitle, setAppTitle] = useState<String | null>(
    'Mexican Sign Language'
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handLandmarker = useRef(null);
  const landmarksRef = useRef(null)
  const [messageBody, setMessageBody] = useState<string | null>('');



 const [canvasDim, setCanvasDim] = useState<{ width: number; height: number }>({
  width: 0,
  height: 0,
});

  useEffect(() => {
    const initializeHandDetection = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );
        handLandmarker.current = await HandLandmarker.createFromOptions(
          vision,
          {
            baseOptions: { modelAssetPath: '/models/hand_landmarker.task' },
            numHands: 1,
            runningMode: 'VIDEO',
          }
        );

        landmarkDetections();
      } catch (error) {
        console.error('Error initializing hand detection:', error);
      }
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

    const landmarkDetections = () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const results = handLandmarker.current.detectForVideo(
          videoRef.current,
          performance.now()
        );

        if (results.landmarks) {
        landmarksRef.current = results.landmarks[0]
        }
      }
    };

    if (!landmarksRef.current || !canvasRef.current) return;

    const canvasWidth = canvasRef.current.clientWidth
    const canvasHeight = canvasRef.current.clientHeight

  
    // if (motionEnabled || !landmarks || !canvas) return;

    const rafInterval = (callback, interval) => {
      let start = performance.now();
      const loop = (now) => {
        if (now - start >= interval) {
          callback();
          start = now;
        }

        requestAnimationFrame(loop);
      };

      requestAnimationFrame(loop);
    };
    const recognizeGestures = () => {
      if (!canvasRef.current) {
        return;
      }
      const canvasWidth = canvasRef.current.clientWidth
      const canvasHeight = canvasRef.current.clientHeight

  
      const pixelVals = landmarksRef.current[0].map(({ x, y, z }) => [
        x * canvasWidth,
        y * canvasHeight,
        z,
      ]);

      const GE = new fp.GestureEstimator(currentLanguage);
      const est = GE.estimate(pixelVals, 6.5);

      const pose = est.poseData;

      if (est.gestures.length > 0) {
        let currGesture = est.gestures.reduce((c1, c2) => {
          return c1.score > c2.score ? c1 : c2;
        });

        let letter = String.fromCharCode(
          parseInt(currGesture.name.slice(1), 16)
        );

        if (letter && pose) {
          setMessageBody((msg) => msg + letter);
        }
      }
    };

    rafInterval(() => {
      recognizeGestures()
    }, 400);

    recognizeGestures();



    // return () => {
    //   if (
    //     videoRef.current &&
    //     videoRef.current.srcObject instanceof MediaStream
    //   ) {
    //     videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    //   }

    //   // if (animationFrameId.current) {
    //   //   cancelAnimationFrame(animationFrameId.current);
    //   // }
    // };
  }, []);


  // useStaticSignsDetect(landmarks, canvasDim, motionDetectionEnabled);

  // useMotionSignsDetect(landmarksRef, motionDetectionEnabled);

  const gestureLanguageToggle = () => {
    if (currentLanguage === ASLGestArray) {
      setCurrentLanguage(MSLGestArray);
      setAppTitle('Mexican Sign Language');
    } else {
      setCurrentLanguage(ASLGestArray);
      setAppTitle('American Sign Language');
    }
  };

  const gestureModeToggle = () => {
    setMotionDetectionEnabled((motion) => !motion);
  };

  return (
    <>
      <h1 style={{ textAlign: 'center' }}>{appTitle}</h1>
      {/* <h2 style={{ textAlign: 'center' }}>{gestureSubTitle} Gesture Detection Enabled</h2> */}
      <button onClick={gestureLanguageToggle}>Toggle Language</button>
      <button onClick={gestureModeToggle}>Toggle Gesture Mode</button>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            height: '500px',
            width: '500px',
            transform: 'scaleX(-1)',
            pointerEvents: 'none',
          }}
        />
      </div>
      {/* <msgBody.Provider value={{ messageBody, setMessageBody }}> */}
        <p style={{ textAlign: 'center', wordWrap: 'break-word' }}>
          {messageBody}
        </p>
      {/* </msgBody.Provider> */}

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
