'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import * as fp from 'fingerpose';
import { MSLGestArray, ASLGestArray } from './signGeneration/generateSigns'
import drawLandmarks from './signDetection/drawLandmarks';
import detectStaticSigns from './signDetection/detectStaticSigns';
import { detectMotionSigns } from './signDetection/detectMotionSigns';
import motionShapes from '../app/motionShapes.json';
import UseVideoStream from './signDetection/useVideoStream';
import { landmarksRefStore } from './signDetection/landmarkRefStore';
import './styles.css';


const mainPage = () => {
  // const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  


  const staticLetter = useRef<string>('');
  const fingerPoseLetter = useRef('');
  const motionLetter = useRef('');
  const animationId = useRef(0);
  const gestureSmoothArr = useRef([]);

  const currentLandmarks = landmarksRefStore.getState().landmarks;


  
  const motionGesturePt = useRef({
    J: null,
    Z: null,
  });

  const [ASLMode, setASLMode] = useState(true);
  const languageArrayRef = useRef(ASLGestArray);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const motionEnabledRef = useRef(false);

 
  const fingerTipsRef = useRef({
    thumbTip: null,
    indexTip: null,
    middleFingerTip: null,
    pinkyTip: null,
  });
  const [messageBody, setMessageBody] = useState('');

  const animationRef = useRef(null);
  const pixelValsRef = useRef(null);


  const [appTitle, setAppTitle] = useState<String | null>(
    'American Sign Language'
  );

  const [subHeading, setSubHeading] = useState('Static');


  const hand_landmarker_task = '/models/hand_landmarker.task';

  let animationFrameId;
  let videoFrameID;
  

  useEffect(() => {
    if (ASLMode) {
      setAppTitle('American Sign Language');
      languageArrayRef.current = ASLGestArray;
    } else {
      setAppTitle('Mexican Sign Language');
      languageArrayRef.current = MSLGestArray;
    }
    setMessageBody('');
  }, [ASLMode]);

  useEffect(() => {
    motionEnabledRef.current = motionEnabled;
  }, [motionEnabled]);

  const rafInterval = (callback, interval) => {
    let start = performance.now();
    const loop = (now) => {

      if (!motionEnabledRef.current && now - start >= interval) {
        callback();
        start = now;
      }

      if (motionEnabledRef.current) {
        cancelAnimationFrame(animationRef.current);
        staticLetter.current = '';

      }

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const detectLandmarks = () => {
        if (currentLandmarks && currentLandmarks.length > 0) {
          const canvas = canvasRef.current;
          const canvasWidth = canvas.clientWidth;
          const canvasHeight = canvas.clientHeight;

          const pixelVals = currentLandmarks.map(({x, y}) => [
            x * canvasWidth,
            y * canvasHeight,
         
          ]);

          pixelValsRef.current = pixelVals;

          fingerTipsRef.current = {
            thumbTip: currentLandmarks[4],
            indexTip: currentLandmarks[8],
            middleFingerTip: currentLandmarks[12],
            pinkyTip: currentLandmarks[20],
          };
        }
      
    };

    const motionSigns = () => {
      if (!motionEnabledRef.current) {
        cancelAnimationFrame(animationId.current);
      }

      detectLandmarks();

      if (currentLandmarks && currentLandmarks.length > 0) {
        const pixelVals = pixelValsRef.current;

        const gestureArr = [];

        if (pixelVals) {

          Object.entries(motionShapes).forEach(([unicodeVal, props]) => {
            const newGesture = new fp.GestureDescription(unicodeVal);
            Object.entries(props.Curls).forEach(([fingerName, curlType]) => {
              newGesture.addCurl(
                fp.Finger[fingerName],
                fp.FingerCurl[curlType],
                1.0
              );
            });
            gestureArr.push(newGesture);
          });
        }

        const GE = new fp.GestureEstimator(gestureArr);

        const est = GE.estimate(pixelVals, 8.0);

        if (est.gestures.length > 0) {
          const result = est.gestures.reduce((c1, c2) => {
            return c1.score > c2.score ? c1 : c2;
          });

          const currUnicode = result.name;
          fingerPoseLetter.current = String.fromCharCode(
            parseInt(currUnicode.slice(1), 16)
          );

          if (motionEnabledRef.current) {
            motionLetter.current = detectMotionSigns(
              fingerTipsRef,
              fingerPoseLetter,
              motionGesturePt
            );
          }

          setMessageBody((msg) => msg + motionLetter.current);
          motionLetter.current = '';
        }
      }
      animationId.current = requestAnimationFrame(motionSigns);
    };

    animationId.current = requestAnimationFrame(motionSigns);

  

    const staticSigns = async () => {
      detectLandmarks();

      // if (!videoRef.current || !canvasRef.current) {
      
      //   return;
      // }

      staticLetter.current = detectStaticSigns(
        languageArrayRef.current,
        pixelValsRef
      );

      const indexFingerTip = fingerTipsRef.current.indexTip;
      const middleFingerTip = fingerTipsRef.current.middleFingerTip;
      const thumbTip = fingerTipsRef.current.thumbTip;

      if (currentLandmarks && staticLetter.current.length === 1) {

        const currentGestureSet = gestureSmoothArr.current

        const smoothGesturePrediction = (predicted) => {
          currentGestureSet.push(predicted);
          if (currentGestureSet.length > 9) {
            gestureSmoothArr.current.shift()
          }

          const modeGesture = currentGestureSet.sort((a, b) =>
            currentGestureSet.filter(v => v === a).length - currentGestureSet.filter(v => v === b).length).pop()

          return modeGesture;
        }

        let stableGesture: string = smoothGesturePrediction(staticLetter.current)

        if (messageBody.length <= 29) {
        if (stableGesture === "null")  {
          stableGesture = ''
        }
        else if (
          indexFingerTip.x > middleFingerTip.x && indexFingerTip.y > middleFingerTip.y &&
          stableGesture === 'R'
        ) {
          setMessageBody((msg) => msg + 'U');
        } 
        else if (
          thumbTip.y - middleFingerTip.y < 0.05 &&
          stableGesture === 'E'
        ) {
          setMessageBody((msg) => msg + 'S');
        } 
        else if (
          indexFingerTip.x - middleFingerTip.x < 0.05 &&
           stableGesture === 'U'
        ) {
          setMessageBody((msg) => msg + 'V');
        } 
        // else if (
        //   languageArrayRef.current === MSLGestArray &&
        //   messageBody.slice(-2) === 'NN'
        // ) {
        //   setMessageBody((msg) => msg.slice(0, -2) + 'Ñ');
        // }
        else {
          setMessageBody((msg) => msg + stableGesture);
        }
      }
        staticLetter.current = '';
      }
    };

    if (!motionEnabledRef.current) {
      rafInterval(staticSigns, 700);

    }


    return () => {
      cancelAnimationFrame(animationFrameId);
      cancelAnimationFrame(animationRef.current);
      cancelAnimationFrame(animationId.current);
    };
  });

  const gestureModeToggle = () => {
    setMotionEnabled((useMotion) => !useMotion);
    subHeading === 'Static' ? setSubHeading('Motion') : setSubHeading('Static');
  };

  const backSpace = () => {
    setMessageBody((msg) => msg.slice(0, -1));
  };

  const gestureLanguageToggle = () => {
    setASLMode((useASL) => !useASL);
  };

  useEffect(() => {
    if (ASLMode) {
      setAppTitle('American Sign Language');
      languageArrayRef.current = ASLGestArray;
    } else {
      setAppTitle('Mexican Sign Language');
      languageArrayRef.current = MSLGestArray;
    }
    setMessageBody('');
  }, [ASLMode]);

  const messageSpace = () => {
    setMessageBody((msg) => msg + ' ');
  };

  const clearMessage = () => {
    setMessageBody('');
  };


  return (
    <div>
      <h1>{appTitle}</h1>
      <h2>
        {subHeading} Gesture Detection Enabled
      </h2>
      <div className="toggleButton">
        <button onClick={gestureLanguageToggle}>
          Toggle <br /> Language
        </button>
        <button onClick={messageSpace}>Space</button>
        <button onClick={gestureModeToggle}>
          Toggle <br /> Gesture Mode
        </button>

        <button className="deletionButton" onClick={backSpace}>
          Backspace
        </button>
        <button className="deletionButton" onClick={clearMessage}>
          Clear Message
        </button>
      </div>
    <div>
      <div
        className="videoDiv"
      >
       <UseVideoStream/>
      </div>
      <div className='messageContainer'></div>

      <div className="messageDiv">
        <p className="messageBody">{messageBody}</p>
      </div>
      <canvas
        ref={canvasRef}
      />
    </div>
    </div>
  );
};

export default mainPage;
