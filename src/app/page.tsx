'use client';
import React, { useEffect, useRef, useState, useContext, createContext } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import * as fp from 'fingerpose';
import { MSLGestArray, ASLGestArray } from '../../components/generateSigns';
import type { HandLandmarkerResult } from '@mediapipe/tasks-vision';
import { useTimeout } from '@chakra-ui/react';
import { motionSigns } from './gestureDetection/motionSigns';
import GestureToggleButton from './gestureDetection/gestureToggle';


// import motionSigns from './motion_gestures/motionSigns';


export const messageContext = createContext<any>('')

const Demo = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const poseRef = useRef(null);
  const indexFingerRef = useRef(null);
  const pinkyRef = useRef(null);
  const [currentLanguage, setCurrentLanguage] = useState(MSLGestArray);
  const [appTitle, setAppTitle] = useState<String | null>(
    'Mexican Sign Language'
  );
  
  const [gestureSubTitle, setGestureSubTitle] = useState<String | null>("Static")
  const gestureDetectionMode = useRef<string | null>("Static")
  const handLandmarker = useRef(null);
  const handLandmarkVals = useRef(null);
  const animationFrameId = useRef(null);
  const [messageBody, setMessageBody] = useState('');
  const hand_landmarker_task = '/models/hand_landmarker.task';

  useEffect(() => {

    const initializeHandDetection = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );
        handLandmarker.current = await HandLandmarker.createFromOptions(
          vision,
          {
            baseOptions: { modelAssetPath: hand_landmarker_task },
            numHands: 1,
            runningMode: 'VIDEO',
          }
        );
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

    const renderLoop = () => {
      if (!videoRef.current || !canvasRef.current || !handLandmarker.current) {
        requestAnimationFrame(renderLoop);
        return;
      }

      if (videoRef.current && videoRef.current.readyState === 4) {
        const results = handLandmarker.current.detectForVideo(
          videoRef.current,
          performance.now()
        );

        const canvas = canvasRef.current;

        const canvasWidth = canvas.clientWidth;
        const canvasHeight = canvas.clientHeight;

       
        handLandmarkVals.current = results.landmarks[0]

        
        if (results.landmarks && results.landmarks.length > 0) {
          const lmVals = results.landmarks[0];

          const pixelVals = lmVals.map(({ x, y, z }) => [
            x * canvasWidth,
            y * canvasHeight,
            z,
          ]);

          const indexVals = results.landmarks[0][8];
          const pinkyVals = results.worldLandmarks[0][20];

          if (indexVals) {
            indexFingerRef.current = indexVals;
          }
          pinkyRef.current = pinkyVals;

          recognizeGestures(pixelVals);

          
        }
      }
    };

    const recognizeGestures = async (landmarks) => {
      const GE = new fp.GestureEstimator(currentLanguage);
      const est = GE.estimate(landmarks, 6.5);
    
      poseRef.current = est.poseData;

      if (est.gestures.length > 0) {
         
        let currGesture = est.gestures.reduce((c1, c2) => {
          return c1.score > c2.score ? c1 : c2;
        });

        let letter = String.fromCharCode(
          parseInt(currGesture.name.slice(1), 16)
        );

        const pose = poseRef.current;

        if (letter && pose) {
          setMessageBody((msg) => msg + letter);
        }
      }
    };

    const liveLandmarks = handLandmarkVals.current;

    
    rafInterval(() => {
      renderLoop();
    }, 400);

    // }
  // }

    return () => {
      if (
        videoRef.current &&
        videoRef.current.srcObject instanceof MediaStream
      ) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);


  const gestureLanguageToggle = () => {
    if (currentLanguage === ASLGestArray) {
      setCurrentLanguage(MSLGestArray);
      setAppTitle('Mexican Sign Language');
    } else {
      setCurrentLanguage(ASLGestArray);
      setAppTitle('American Sign Language');
    }
  };


  return (
    <>
      {/* 
      <button
        onClick={() => {
          // jRecognize();
        }}
      >
        Detect Hand
      </button> */}
      <h1 style={{ textAlign: 'center' }}>{appTitle}</h1>
      <h2 style={{ textAlign: 'center' }}>{gestureSubTitle} Gesture Detection Enabled</h2>
      <button onClick={gestureLanguageToggle}>Toggle Language</button>

      <messageContext.Provider value={[messageBody,setMessageBody]}>
        <GestureToggleButton landmarks={handLandmarkVals.current}/>
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
      </messageContext.Provider>

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
