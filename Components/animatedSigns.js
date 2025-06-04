import * as posenet from '@tensorflow-models/posenet';
import '@tensorflow/tfjs-backend-webgl';











// import { GestureRecognizer } from "@mediapipe/tasks-vision";
// import {
//   GestureRecognizer,
//   FilesetResolver,
//   DrawingUtils,
// } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";


// const animatedSigns = async () => {


//     const vision = await FilesetResolver.forVisionTasks(
//         "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm "
//     );

//     const recognizeGesture = await GestureRecognizer.createFromOptions(vision, {
//         baseOptions: {
//             modelAssetPath: "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task"
//         },
//         numHands: 1
//     });

//     await recognizeGesture.setOptions({runningMode: "video"});

//     let lastVideoTime = -1;

//     const renderLoop = () => {
//           const video = document.getElementById("video");

//   if (video.currentTime !== lastVideoTime) {
//     const gestureRecognitionResult = gestureRecognizer.recognizeForVideo(video);
//     processResult(gestureRecognitionResult);
//     lastVideoTime = video.currentTime;
//   }

//   requestAnimationFrame(() => {
//     renderLoop();
//   });
//     }

// }