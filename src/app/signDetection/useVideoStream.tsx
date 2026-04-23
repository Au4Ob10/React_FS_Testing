import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { landmarksRefStore } from './landmarkRefStore';


const UseVideoStream = () => {


    // Code below adapted from:
  // K. Chaudhari, “Integrating MediaPipe Tasks Vision for Hand Landmark Detection in React,” Medium.
  // https://medium.com/@kiyo07/integrating-mediapipe-tasks-vision-for-hand-landmark-detection-in-react-a2cfb9d543c7
  // Accessed: Nov. 14, 2025.
  
  const hand_landmarker_task = '/models/hand_landmarker.task';

  const videoRef = useRef<HTMLVideoElement>(null);
  const landmarkDetect = useRef(null);
 

  
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

    
    return () => {
      if (
        videoRef.current &&
        videoRef.current.srcObject instanceof MediaStream
      ) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }

      // videoRef.current.cancelVideoFrameCallback(videoFrameID);

    };
  }, []);


  useEffect(() => {
    const detectLandmarks = () => {
      if (
        videoRef.current &&
        videoRef.current.readyState === 4 &&
        landmarkDetect.current
      ) {

        const handProps = landmarkDetect.current.detectForVideo(
          videoRef.current,
          performance.now()
        );

        

        const setLandmarks = landmarksRefStore((state) => state.setLandmarks)

        setLandmarks(handProps.landmarks[0])

        console.log(landmarksRefStore.getState().landmarks)

      }
    }
    detectLandmarks();
  })

  return (
      <video
          ref={videoRef}
          autoPlay
          playsInline
        />
  )
}

export default UseVideoStream;