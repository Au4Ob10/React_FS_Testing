"use client";



// Copyright 2023 The MediaPipe Authors.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//      http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import {
  GestureRecognizer,
  FilesetResolver,
  DrawingUtils
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

const demosSection = document.getElementById("demos");
let gestureRecognizer: GestureRecognizer;
let runningMode = "VIDEO";
let enableWebcamButton: HTMLButtonElement;
let webcamRunning: Boolean = false;
const videoHeight = "360px";
const videoWidth = "480px";


const webcamRef = useRef(null)
const canvasRef = useRef(null)
const buttonRef = useRef(null)
const gestureOutputRef = useRef(null)


// Before we can use HandLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
const createGestureRecognizer = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
      delegate: "GPU"
    },
    runningMode: runningMode
  });
  demosSection.classList.remove("invisible");
};
createGestureRecognizer();

/********************************************************************
// Demo 2: Continuously grab image from webcam stream and detect it.
********************************************************************/

const video = webcamRef.current.srcObject
const canvasElement = canvasRef.current
const canvasCtx = canvasElement.getContext("2d");
const gestureOutput = gestureOutputRef.current

// Check if webcam access is supported.
function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
  enableWebcamButton = webcamRef.current
  enableWebcamButton.addEventListener("click", enableCam);
} else {
  console.warn("getUserMedia() is not supported by your browser");
}

// Enable the live webcam view and start detection.
function enableCam(event) {
  if (!gestureRecognizer) {
    alert("Please wait for gestureRecognizer to load");
    return;
  }

  if (webcamRunning === true) {
    webcamRunning = false;
    enableWebcamButton.innerText = "ENABLE PREDICTIONS";
  } else {
    webcamRunning = true;
    enableWebcamButton.innerText = "DISABLE PREDICTIONS";
  }

  // getUsermedia parameters.
  const constraints = {
    video: true
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    video.srcObject = stream;
    video.addEventListener("loadeddata", predictWebcam);
  });
}

let lastVideoTime = -1;
let results = undefined;
async function predictWebcam() {
  const webcamElement = document.getElementById("webcam");
  // Now let's start detecting the stream.
  if (runningMode === "IMAGE") {
    runningMode = "VIDEO";
    await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
  }
  let nowInMs = Date.now();
  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    results = gestureRecognizer.recognizeForVideo(video, nowInMs);
  }

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  const drawingUtils = new DrawingUtils(canvasCtx);

  canvasElement.style.height = videoHeight;
  webcamElement.style.height = videoHeight;
  canvasElement.style.width = videoWidth;
  webcamElement.style.width = videoWidth;

  if (results.landmarks) {
    for (const landmarks of results.landmarks) {
      drawingUtils.drawConnectors(
        landmarks,
        GestureRecognizer.HAND_CONNECTIONS,
        {
          color: "#00FF00",
          lineWidth: 5
        }
      );
      drawingUtils.drawLandmarks(landmarks, {
        color: "#FF0000",
        lineWidth: 2
      });
    }
  }
  canvasCtx.restore();
  if (results.gestures.length > 0) {
    gestureOutput.style.display = "block";
    gestureOutput.style.width = videoWidth;
    const categoryName = results.gestures[0][0].categoryName;
    const categoryScore = parseFloat(
      (results.gestures[0][0].score * 100).toString()
    ).toFixed(2);
    const handedness = results.handednesses[0][0].displayName;
    gestureOutput.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}`;
  } else {
    gestureOutput.style.display = "none";
  }
  // Call this function again to keep predicting when the browser is ready.
  if (webcamRunning === true) {
    window.requestAnimationFrame(predictWebcam);
  }

  return (
    <div>
    <Webcam ref={webcamRef}/>
    <p>{gestureOutputRef.current.value}</p>
    </div>
  )
}


// // import React, { useRef } from "react"
// import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";
// // import hand_landmarker_task from '../../public/models/hand_landmarker.task'
// import Webcam from "react-webcam";

// import React, { useEffect, useRef, useState } from "react";

// const detectHands = () => {

//   const webcamRef = useRef(null);

//   const [lastVideoTime, setLastVideoTime] = useState(-1)

//   let videoStream;

//   useEffect(() => {

//     const startWebcam = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//         });

//         webcamRef.current.srcObject = stream;

//         videoStream = webcamRef.current.srcObject

   
//       } catch (err) {
//         /* handle the error */
//       }
//     }
  
//     startWebcam();
//   });

//   const detectGesture = async () => {
//    const vision = await FilesetResolver.forVisionTasks(
//       "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
//     );

//     const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
//      baseOptions: {
//       modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task"
//       },
//     numHands: 1 });

//     await gestureRecognizer.setOptions({runningMode: "VIDEO"})

//     const renderLoop = () => {

//       const video = document.getElementById("video")

//       if (videoStream.currentTime !== lastVideoTime) {
//         const gestureRecognitionResult = gestureRecognizer.recognizeForVideo(video);
//         processResult(gestureRecognitionResult)
//         setLastVideoTime(video.currentTime)
//       }

//       requestAnimationFrame(() => {
//         renderLoop()
//       })
//     }

    


//     // const recognitions = gestureRecognizer.recognize(videoStream)

//       console.log("recognitions:", recognitions)
//     }

//     detectGesture();


//   return (
//     <Webcam id={"video"} ref={webcamRef} autoPlay={true} style={{ transform: "scaleX(-1)"}}/>
//   )
// };

// export default detectHands;

// // const gestureFunc = () => {

// //   type refObj= any

// //     const webcamRef: refObj = useRef(null)
// //     const canvasRef: refObj = useRef(null)

// //   // Set video width

// //   // if (
// //   //   typeof webcamRef.current !== "undefined" &&
// //   //   webcamRef.current !== null &&
// //   //   webcamRef.current.video.readyState === 4
// //   // ) {
// //   // const video = webcamRef?.current?.video

// //   // const videoWidth = webcamRef.current.video.videoWidth
// //   // const videoHeight = webcamRef.current.video.videoHeight

// //   // webcamRef.current.video.width = videoWidth
//   // webcamRef.current.video.height = videoHeight

//   // Set canvas height and width
//   // canvasRef?.current?.width = videoWidth
//   // canvasRef.current.height = videoHeight

//   // const canvasContext = canvasRef.current.getContext("2d")

//   let gestureRecognizer = GestureRecognizer

//   const createGestureRecognizer = async () => {
//     const vision = await FilesetResolver.forVisionTasks(
//       "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
//     )

//     const gestureRecognizer = await GestureRecognizer.createFromModelPath(
//       vision,
//       "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task"
//     )

//     const video = document.getElementById("webcamID") as HTMLVideoElement
//     const recognitions = gestureRecognizer.recognize(video)

//     console.log(recognitions)
//   }

//   createGestureRecognizer()

//   return (
//     <div>
//       <Webcam id={"webcamID"} ref={webcamRef} />
//     </div>
//   )
//  }

// export default gestureFunc

// const gestureFunc = () => {

// useEffect (() => {
// const createGestureRecognizer = async () => {
//   const vision = await FilesetResolver.forVisionTasks(
//     "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
//   );

//   gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
//     baseOptions: {
//       modelAssetPath: hand_landmarker_task,
//       delegate: "CPU",
//     },
//     runningMode: "IMAGE"
//   });

// };

// createGestureRecognizer();

// }, [])

// const video = document.getElementById("webcam");
// const canvasElement = document.getElementById("output_canvas");
// const canvasCtx = canvasRef.current.getContext("2d")

// const gestureOutput = document.getElementById("gesture_output");

// useEffect(() => {

//   const hasGetUserMedia = () => {
//   return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
// };
// }, [])

// if (hasGetUserMedia) {
//   enableWebcamButton = document.getElementById("webcamButton");
//   enableWebcamButton.addEventListener("click", enableCam);
// } else {
//   console.warn("getUserMedia() is not supported by your browser");
// }

// const enableCam = (event) => {
//   if (!gestureRecognizer) {
//     alert("Please wait for gestureRecognizer to load");
//     return;
//   }
//   if (webcamRunning === true) {
//     webcamRunning = false;
//     enableWebcamButton.innerText = "ENABLE PREDICTIONS";
//   } else {
//     webcamRunning = true;
//     enableWebcamButton.innerText = "DISABLE PREDICTIONS";
//   }

//   const constraints = {
//     video: true,
//   };

//   navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
//     video.srcObject = stream;
//     video.addEventListener("loadeddata", predictWebcam);
// });}

// let lastVideoTime = -1;
// let results = undefined;

// const predictWebcam = async () => {
//   const webcamElement = document.getElementById("webcam");

//   if (runningMode === "IMAGE") {
//     runningMode = "VIDEO";

//     await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
//   }

//   let nowInMs = Date.now();
//   if (video.currentTime !== lastVideoTime) {
//     lastVideoTime = video.currentTime;
//     results = gestureRecognizer.recognizeForVideo(video, nowInMs);
//   }

//   canvasCtx.save();
//   canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
//   const drawingUtils = new DrawingUtils(canvasCtx);

//   canvasElement.style.height = videoHeight;
//   webcamElement.style.height = videoHeight;
//   canvasElement.style.width = videoWidth;
//   webcamElement.style.width = videoWidth;

//  if (results.landmarks) {
//     for (const landmarks of results.landmarks) {
//       drawingUtils.drawConnectors(
//         landmarks,
//         GestureRecognizer.HAND_CONNECTIONS,
//         {
//           color: "#00FF00",
//           lineWidth: 5
//         }
//       );
//       drawingUtils.drawLandmarks(landmarks, {
//         color: "#FF0000",
//         lineWidth: 2
//       });
//     }
//   }
//   canvasCtx.restore();
//   if (results.gestures.length > 0) {
//     gestureOutput.style.display = "block";
//     gestureOutput.style.width = videoWidth;
//     const categoryName = results.gestures[0][0].categoryName;
//     const categoryScore = parseFloat(
//       results.gestures[0][0].score * 100
//     ).toFixed(2);
//     const handedness = results.handednesses[0][0].displayName;
//     gestureOutput.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}`;
//   } else {
//     gestureOutput.style.display = "none";
//   }
//   // Call this function again to keep predicting when the browser is ready.
//   if (webcamRunning === true) {
//     window.requestAnimationFrame(predictWebcam);
//   }
// }

// return (
// <div>
//   <Helmet>
//     <link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet"/>
// <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script>
// </Helmet>
// <h1>Recognize hand gestures using the MediaPipe HandGestureRecognizer task</h1>
//   <h2><br/>Demo: Webcam continuous hand gesture detection</h2>
//   <p>Use your hand to make gestures in front of the camera to get gesture classification. Click <b>enable webcam</b> below and grant access to the webcam if prompted.</p>

//   <div id="liveView" class="videoView">
//     <button id="webcamButton" class="mdc-button mdc-button--raised">
//       <span class="mdc-button__ripple"></span>
//       <span class="mdc-button__label">ENABLE WEBCAM</span>
//     </button>
//     <div style="position: relative;">
//       <video id="webcam" autoplay playsinline></video>
//       <canvas id="output_canvas" ref={canvasRef} width="1280" height="720" style="position: absolute; left: 0px; top: 0px;"></canvas>
//       <p id='gesture_output' class="output"/>
//     </div>
//   </div>
//   </div>

// )
// }

// export default gestureFunc;
