'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import * as fp from 'fingerpose';
import { MSLGestArray, ASLGestArray } from '../../components/generateSigns';
import type { HandLandmarkerResult } from '@mediapipe/tasks-vision';
import { useTimeout } from '@chakra-ui/react';

const Demo = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gesturePtRef = useRef<String | null>(null);
  const poseRef = useRef(null)
  const indexFingerRef = useRef(null);
  const pinkyRef = useRef(null);
  const indexTipArr = useRef([]);
  const pinkyTipArr = useRef([]);
  const letterRef = useRef<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState(MSLGestArray);

  const [appTitle, setAppTitle] = useState<String | null>(
    'Mexican Sign Language'
  );

  const [messageBody, setMessageBody] = useState('');

  const hand_landmarker_task = '/models/hand_landmarker.task';
  let handLandmarker;
  let animationFrameId;

  useEffect(() => {
    const initializeHandDetection = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: hand_landmarker_task },
          numHands: 1,
          runningMode: 'VIDEO',
        });
        // detectHands();
      } catch (error) {
        console.error('Error initializing hand detection:', error);
      }
      animationFrameId = requestAnimationFrame(initializeHandDetection);
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
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  useEffect(() => {
    let animationFrameId;

    const drawLandmarks = (landmarksArray) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!canvas || !ctx || !landmarksArray || landmarksArray.length === 0)
        return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'green';
      ctx.lineWidth = 2;

      const handJoints = {
        thumb: [0, 1, 2, 3, 4],
        index: [5, 6, 7, 8],
        middle: [9, 10, 11, 12],
        ring: [13, 14, 15, 16],
        pinky: [17, 18, 19, 20],
        palm: [5, 9, 13, 17, 0, 5],
      };

      Object.values(handJoints).forEach((jointArr) => {
        const arrLen = jointArr.length;
        const lineStartArr = jointArr.slice(0, arrLen - 1);
        const lineEndArr = jointArr.slice(1);

        lineStartArr.forEach((startIdx, i) => {
          const lineStart = landmarksArray[0][startIdx];
          const lineEnd = landmarksArray[0][lineEndArr[i]];

          ctx.beginPath();
          ctx.moveTo(lineStart.x * canvas.width, lineStart.y * canvas.height);
          ctx.lineTo(lineEnd.x * canvas.width, lineEnd.y * canvas.height);
          ctx.stroke();
        });
      });

      ctx.fillStyle = 'red';
      landmarksArray.forEach((landmarks) => {
        landmarks.forEach((landmark) => {
          const x = landmark.x * canvas.width;
          const y = landmark.y * canvas.height;

          ctx.beginPath();
          ctx.arc(x, y, 2, 0, 2 * Math.PI);
          ctx.fill();
        });
      });
    };

    const renderLoop = async () => {
      if (!videoRef.current || !canvasRef.current || !handLandmarker) {
        animationFrameId = requestAnimationFrame(renderLoop);
        return;
      }
      if (videoRef.current && videoRef.current.readyState === 4) {
        const results = handLandmarker.detectForVideo(
          videoRef.current,
          performance.now()
        );

        const canvas = canvasRef.current;

        const canvasWidth = canvas.clientWidth;
        const canvasHeight = canvas.clientHeight;

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

          // drawLandmarks(results.landmarks);

          recognizeGestures(pixelVals);

          // zGestures();
        }

        animationFrameId = requestAnimationFrame(renderLoop);
      }
    };

    renderLoop();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  let letterOutput;

  useEffect(() => {
    const jRecognize = () => {
      const pinkyVals = pinkyRef.current;

      if (pinkyVals) {
        pinkyTipArr.current.push({
          x: pinkyVals.x,
          y: pinkyVals.y,
          z: pinkyVals.z,
        });

        const x1 = pinkyTipArr.current[0].x;
        const x2 = pinkyTipArr.current.at(-1).x;

        const y1 = pinkyTipArr.current[0].y;
        const y2 = pinkyTipArr.current.at(-1).y;

        setTimeout(() => {
          if (x2 < -0.01 && y2 < -0.06) {
            gesturePtRef.current = 'first point';
            console.log(gesturePtRef.current);
          }
        }, 300);

        setTimeout(() => {
          if (
            x2 > -0.001 &&
            y2 < -0.01 &&
            gesturePtRef.current === 'first point'
          ) {
            gesturePtRef.current = 'second point';
            console.log(gesturePtRef.current);
          }
        }, 300);

        setTimeout(() => {
          if (
            x2 > 0.07 &&
            y2 < -0.02 &&
            gesturePtRef.current === 'second point'
          ) {
            gesturePtRef.current = 'third point';
            console.log(gesturePtRef.current);

            letterRef.current = 'J';
            letterRef.current = null;
          }
        }, 300);
      }
      requestAnimationFrame(jRecognize);
    };
    requestAnimationFrame(jRecognize);

    return () => {
      gesturePtRef.current = null;
      pinkyTipArr.current = [];
    };
  }, []);

  useEffect(() => {
    const zGestures = () => {
      const indexVals = indexFingerRef.current;
      if (indexVals) {
        indexTipArr.current.push(indexVals);

        if (indexTipArr.current.length >= 2) {
          const x1: any = indexTipArr.current[0].x;
          const y1 = indexTipArr.current[0].y;
          const x2: any = indexTipArr.current.at(-1).x;
          const y2 = indexTipArr.current.at(-1).y;

          console.log("x:", x2)
          console.log("y:", y2)

          const zGesture = new fp.GestureDescription('z-sign');

        
          // const est = GE.estimate(landmarksRef.current, 6.5);

          setTimeout(() => {
            if (x2 > 0.6 && y2 < 5 && gesturePtRef.current === null) {
              gesturePtRef.current = 'gestureStart';
              console.log(gesturePtRef.current);
            }

            if (x2 < 0.5 && y2 < 5 && gesturePtRef.current === 'gestureStart') {
              gesturePtRef.current = 'firstGesture';
              console.log(gesturePtRef.current);
              indexTipArr.current = [];
            }
          }, 300);

          setTimeout(() => {
            if (
              x2 < 0.7 &&
              y2 > 0.7 &&
              gesturePtRef.current === 'firstGesture'
            ) {
              gesturePtRef.current = 'secondGesture';
              console.log(gesturePtRef.current);
              indexTipArr.current = [];
            }
          }, 100);

          setTimeout(() => {
            if (x2 < 0.5 && gesturePtRef.current === 'secondGesture') {
              gesturePtRef.current = 'thirdGesture';
              console.log(gesturePtRef.current);
              setMessageBody((msg) => msg + 'Z');
              indexTipArr.current = [];
            }
          }, 100);
        }
      }
      requestAnimationFrame(zGestures);
    };

    requestAnimationFrame(zGestures);

    return () => {
      gesturePtRef.current = null;
    };
  }, []);

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

  const recognizeGestures = async (landmarks) => {
    const GE = new fp.GestureEstimator(currentLanguage);
    const est = GE.estimate(landmarks, 6.5);

    poseRef.current = est.poseData;

    if (est.gestures.length > 0) {
      let result = est.gestures.reduce((c1, c2) => {
        return c1.score > c2.score ? c1 : c2;
      });

      const currUnicode = result.name;

      let letter = String.fromCharCode(parseInt(currUnicode.slice(1), 16));
      const lastChars = messageBody.slice(-2);

      if (lastChars === 'U004EU004E') {
        lastChars.replace('U004EU004E', 'U00D1').slice(0);
        return;
        // setMessageBody((msg) => msg + lastChars);
      } else {
        letterRef.current = letter;
        //     rafInterval(() => {

        //       console.log(letter.length)
        //       setMessageBody((msg) => msg + letter);
        //     }, 1000);
      }
    }
  };
   let number = 1;

  useEffect(() => {
    rafInterval(() => {
      const letter = letterRef.current;
      // console.log(poseRef.current)
      if (letter && number <= 20 && poseRef) {
        setMessageBody((msg) => msg + letter);
        number += 1
        
        letterRef.current = null;
      }
    }, 300);

  
  }, [number]);

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
      <button onClick={gestureLanguageToggle}>Toggle Language</button>

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

      <p style={{ textAlign: 'center' }}>{messageBody}</p>

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
