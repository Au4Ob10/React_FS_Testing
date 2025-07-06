'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import * as fp from 'fingerpose';
import gestArray from '../../components/generateSigns';
import type { HandLandmarkerResult } from '@mediapipe/tasks-vision';
import { useTimeout } from '@chakra-ui/react';

// import {
//   Text,
//   Heading,
//   Button,
//   Stack,
//   Container,
//   Box,
//   VStack,
//   ChakraProvider
// } from "@chakra-ui/react"

const Demo = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const indexFingerRef = useRef(null);
  const landmarksRef = useRef(null);
  const gesturePtRef = useRef<String | null>(null);
  const pinkyRef = useRef(null);
  const pinkyTipArr = useRef([]);
  const gestureRef = useRef<String | null>(null);
  const [handPresence, setHandPresence] = useState(null);
  const landmarkBuffer = useRef<{ x: number; y: number; z: number }[]>([]);
  const [smoothedIndex, setSmoothedIndex] = useState({ x: 0, y: 0, z: 0 });

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

          indexFingerRef.current = indexVals;
          pinkyRef.current = pinkyVals;
          landmarksRef.current = results.landmarks;

          drawLandmarks(results.landmarks);

          recognizeGestures(pixelVals);

          // zGestures();
        }

        animationFrameId = requestAnimationFrame(renderLoop);
      }
    };

    renderLoop();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // useEffect(() => {
  //   const zGestures = () => {
  //     const indexVals = indexFingerRef.current;
  //     if (indexVals) {
  //       landmarkBuffer.current.push(indexVals);

  //       if (landmarkBuffer.current.length >= 2) {
  //         const x1: any = landmarkBuffer.current[0].x;
  //         const y1 = landmarkBuffer.current[0].y;
  //         const x2: any = landmarkBuffer.current.at(-1).x;
  //         const y2 = landmarkBuffer.current.at(-1).y;
  //         const deltaX = x2 - x1;
  //         const deltaY = y2 - y1;
  //         const slope = Math.abs(y2 - y1) / Math.abs(x2 - x1);
  //         const gesture = gestureRef.current;

  //         const zGesture = new fp.GestureDescription('z-sign')

  //         // const est = GE.estimate(landmarksRef.current, 6.5);

  //         setTimeout(() => {
  //           if (x2 > 0.6 && y2 < 5 && gestureRef.current === null) {
  //             gestureRef.current = 'gestureStart';
  //             console.log(gestureRef.current);
  //           }

  //           if (x2 < 0.5 && y2 < 5 && gestureRef.current === 'gestureStart') {
  //             gestureRef.current = 'firstGesture';
  //             console.log(gestureRef.current);
  //             landmarkBuffer.current = [];
  //           }
  //         }, 300);

  //         setTimeout(() => {
  //           if (x2 < 0.7 && y2 > 0.7 && gestureRef.current === 'firstGesture') {
  //             gestureRef.current = 'secondGesture';
  //             console.log(gestureRef.current);
  //             landmarkBuffer.current = [];
  //           }
  //         }, 100);

  //         setTimeout(() => {
  //           if (x2 < 0.5 && gestureRef.current === 'secondGesture') {
  //             gestureRef.current = 'thirdGesture';
  //             console.log(gestureRef.current);
  //             console.log('Z');
  //             landmarkBuffer.current = [];
  //           }
  //         }, 100);

  //       }
  //     }
  //     requestAnimationFrame(zGestures);
  //   };

  //   requestAnimationFrame(zGestures);
  // }, []);

  // useEffect(() => {
  //   const jGestures = () => {

  //   }

  //  }, []);

  // const zRecognize = () => {
  //   const indexVals = indexFingerRef.current;

  //   if (indexVals) {
  //     indexArrRef.current.push({ x: indexVals.x, y: indexVals.y });

  //     if (indexArrRef.current.length >= 1) {
  //       const x1 = indexArrRef.current[0].x;
  //       const y1 = indexArrRef.current[0].y;
  //       // const z1 = indexArrRef.current[0].z;
  //       const x2 = indexArrRef.current.at(-1).x;
  //       const y2 = indexArrRef.current.at(-1).y;

  //       const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1)) * 100;
  //       const deltaX = x2 - x1;
  //       const deltaY = y2 - y1;
  //       const slope = (y2 - y1) / (x2 - x1);

  //       console.log('Current X:', x2);
  //       // console.log('Current Y:', y2);
  //       console.log(deltaX);
  //       // console.log(deltaY);
  //     }
  //     // console.log("Current Y", y2)
  //     // console.log('slope:', slope);
  //     indexFingerRef.current = [];
  //   }
  // };
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

       

        // setTimeout(() => {
        //   if (x2 < -0.01 && y2 < -0.06) {
        //     gesturePtRef.current = 'first point';
        //     console.log(gesturePtRef.current);
        //   }
        // }, 300);

        // setTimeout(() => {
        //   if (
        //     x2 > -0.001 &&
        //     y2 < -0.01 &&
        //     gesturePtRef.current === 'first point'
        //   ) {
        //     gesturePtRef.current = 'second point';
        //     console.log(gesturePtRef.current);
        //   }
        // }, 300);

        // setTimeout(() => {
        //   if (
        //     x2 > 0.07 &&
        //     y2 < -0.02 &&
        //     gesturePtRef.current === 'second point'
        //   ) {
        //     gesturePtRef.current = 'third point';
        //     console.log(gesturePtRef.current);
        //     console.log("J")
        //   }
        // }, 300);


      }
      requestAnimationFrame(jRecognize);
    };
    requestAnimationFrame(jRecognize);

    // return (() => {
    //   gesturePtRef.current = null
    //   pinkyTipArr.current = []
    // })
  }, []);

  const recognizeGestures = async (landmarks) => {
    const GE = new fp.GestureEstimator(gestArray);
    const est = GE.estimate(landmarks, 6.5);
   console.log(est.poseData)
   

    if (est.gestures.length > 0) {
      let result = est.gestures.reduce((c1, c2) => {
        return c1.score > c2.score ? c1 : c2;
      });
      console.log(result)
    }
  };

  return (
    <>
      <h1>
        Is there a Hand?
        {handPresence ? 'Yes' : 'No'}
        {/* {handPresence ? 'Yes' : 'No'} */}
      </h1>

      <button
        onClick={() => {
          // jRecognize();
        }}
      >
        Detect Hand
      </button>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          top: 0,
          left: 0,
          zIndex: 1,
          transform: 'scaleX(-1)',
          pointerEvents: 'none',
        }}
      />

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
          pointerEvents: 'none', // prevents canvas from blocking clicks
        }}
      />
    </>
  );
};

export default Demo;
