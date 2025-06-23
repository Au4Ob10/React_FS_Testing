'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import * as fp from 'fingerpose';
import gestArray from '../../../components/generateSigns';
import type { HandLandmarkerResult } from '@mediapipe/tasks-vision';
import * as tf from "@tensorflow/tfjs"
import * as handpose from "@tensorflow-models/handpose"
import Webcam from "react-webcam";


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
  const [textTitle, setTextTitle] = useState('Now Loading...');
  const [tutorText, setTutorText] = useState('');
  const [handDetections, setHandDetections] = useState(null);



//   useEffect(() => {

//     const startWebcam = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//         });
//         videoRef.current.srcObject = stream;
//         const net = await handpose.load()
//         detectHands(net)

        
//       } catch (error) {
//         console.error('Error accessing webcam:', error);
//       }
//     };

//     startWebcam();

//     return () => {
//     if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
//   videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
// }
//     };
//   }, []);


const detectVideo = () => {
     if (
      typeof videoRef.current !== "undefined" &&
      videoRef.current !== null &&
      videoRef.current.video.readyState === 4
    )  {
     const video = videoRef.current.video
      const videoWidth = video.width 
      const videoHeight = video.height

      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight
      detectHands(video)
      
}
}

detectVideo()

  const detectHands = async (video) => {
   
      const net = await handpose.load()
      const hand = net.estimateHands(video)

      recognizeGestures(hand);
    }

  
    const recognizeGestures = async (hand) => {

    if (hand.length > 0) {
    const GE = new fp.GestureEstimator(gestArray);
    const est = GE.estimate(hand[0].landmarks, 6.5);

    console.log(est)

    if (est.gestures.length > 0) {
      let result = est.gestures.reduce((c1, c2) => {
        return c1.score > c2.score ? c1 : c2;
      });

     
    }

 
  };
}

        // setLandmarksState(detections.landmarks);

        // drawLandmarks(detections.landmarks);



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
  }

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

   
        <Webcam
          ref={videoRef}
          autoPlay
          playsInline
          mirrored={true}
    
          style={{
            position: 'absolute',
            height: "100%",
             width: "100%",
            top: 0,
            left: 0,
            zIndex: 1,
            // transform: 'scaleX(-1)',
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            height: "100%",
             width: "100%",
            top: 0,
            left: 0,
            zIndex: 2,
            // transform: 'scaleX(-1)',
            pointerEvents: 'none', // prevents canvas from blocking clicks
          }}
        />
    </>
  );
};

export default Demo
