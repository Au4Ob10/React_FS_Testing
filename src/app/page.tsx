'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import * as fp from 'fingerpose';
import gestArray from '../../components/generateSigns';
import type { HandLandmarkerResult } from '@mediapipe/tasks-vision';

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
  const videoRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const landmarksRef = useRef(null);
  const [myPoseData, setmyPoseData] = useState(null);
  const poseRef = useRef(null);
  const [landmarksState, setLandmarksState] = useState(null);
  const gestureRef = useRef(null);
  const [handPresence, setHandPresence] = useState(null);
  const [gameState, setGameState] = useState('started');
  const [camState, setCamState] = useState('on');
  const [sign, setSign] = useState(null);
  const [messageBody, setMessageBody] = useState('');
  const [currentSign, setCurrentSign] = useState(0);
  const [textTitle, setTextTitle] = useState('🧙‍♀️ Loading the Magic 🧙‍♂️');
  const [tutorText, setTutorText] = useState('');
  const [handDetections, setHandDetections] = useState(null);

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
      animationFrameId = requestAnimationFrame(detectHands);
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
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      //   if (handLandmarker) {
      //     handLandmarker.close();
      //   }

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const detectHands = () => {
    if (videoRef.current && videoRef.current.readyState >= 2) {
      const detections: HandLandmarkerResult = handLandmarker.detectForVideo(
        videoRef.current,
        performance.now()
      );

      setHandPresence(detections.handedness.length > 0);

      if (detections) {
        setHandDetections(detections);
      }

      if (detections.landmarks && detections.landmarks.length > 0) {
        const { x, y, z } = detections.landmarks[0][0];

        const flippedLandmarks = detections.landmarks[0].map((point) => ({
          x: 1 - point.x,
          y: point.y,
          z: point.z,
        }));

         landmarksRef.current = flippedLandmarks

   

        gestureRef.current = detections.landmarks;

        setLandmarksState(detections.landmarks);

        drawLandmarks(detections.landmarks);

        // recognizeGestures(detections.landmarks[0]);
      }
    } else {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      landmarksRef.current = null;
      gestureRef.current = null;
      setLandmarksState(null);
      setHandPresence(false);
    }
    requestAnimationFrame(detectHands);
  };

  const drawLandmarks = (landmarksArray: any) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //   if (!ctx || !landmarksArray || landmarksArray.length === 0) return;

    ctx.fillStyle = 'white';
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
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  };

  //   if (gestureRef.current) {
  //     drawLandmarks(gestureRef.current);
  //   }

  const recognizeGestures = async (landmarks) => {


    const GE = new fp.GestureEstimator(gestArray);
    const est = GE.estimate(landmarks, 9);


    console.log(est.poseData)
    if (est.gestures.length > 0) {
      let result = est.gestures.reduce((c1, c2) => {
        return c1.score > c2.score ? c1 : c2;
      });
    }
  };

//   useEffect(() => {
//     const gestureInterval = setInterval(() => {
//       if (landmarksRef.current) {
//         recognizeGestures(landmarksRef.current);
//       }
//     }, 1000);
//     return () => {
//       clearInterval(gestureInterval);
//     };
//   }, []);

  //   poseRef.current
  //   const detectHand = () => {
  //     if (
  //       console.log(poseRef.current);
  //     }

  return (
    <>
      <h1>Is there a Hand? 
           {handPresence ? 'Yes' : 'No'}
         {/* {handPresence ? 'Yes' : 'No'} */}
         </h1>

      <button onClick={() => {
  if (landmarksRef.current) {
    recognizeGestures(landmarksRef.current);
  } else {
    console.warn("No landmarks available.");
  }
}}>Detect Hand</button>

      <div
        style={{
          position: 'relative',
          width: '640px', // or % or responsive values
          height: '480px', // match your desired aspect ratio
          margin: '1rem auto', // center and add spacing
          border: '1px solid #ccc',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            transform: 'scaleX(-1)',
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
            transform: 'scaleX(-1)',
            pointerEvents: 'none', // prevents canvas from blocking clicks
          }}
        />
      </div>
    </>
  );
};

export default Demo;
