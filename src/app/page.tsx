"use client";

// import React, { useEffect, useRef, useState } from "react";
// import {
//   FilesetResolver,
//   HandLandmarker,
//   GestureRecognizer,
//   DrawingUtils,
// } from "@mediapipe/tasks-vision";
// import Webcam from "react-webcam";


import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import motionVals from "../../Components/fs_styles/Mexican_Motion_Vals.json"


const Demo = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [handPresence, setHandPresence] = useState(null);
    const [latestDetection, setLatestDetection] = useState(null);


   

    const hand_landmarker_task = "/models/hand_landmarker.task"

    useEffect(() => {
        let handLandmarker;
        let animationFrameId;

        const initializeHandDetection = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
                );
                handLandmarker = await HandLandmarker.createFromOptions(
                    vision, {
                        baseOptions: { modelAssetPath: hand_landmarker_task },
                        numHands: 1,
                        runningMode: "VIDEO"
                    }
                );
                detectHands();
            } catch (error) {
                console.error("Error initializing hand detection:", error);
            }
        };

    const drawLandmarks = (landmarksArray) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';

    landmarksArray.forEach(landmarks => {
        landmarks.forEach(landmark => {
            const x = landmark.x * canvas.width;
            const y = landmark.y * canvas.height;

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI); // Draw a circle for each landmark
            ctx.fill();
        });
    });
};





        const detectHands = () => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
                const detections = handLandmarker.detectForVideo(videoRef.current, performance.now());
                
                
                setHandPresence(detections.handednesses.length > 0);
                setLatestDetection(detections)
  


                // Assuming detections.landmarks is an array of landmark objects
                if (detections.landmarks) {
                    drawLandmarks(detections.landmarks);
                }
            }
            requestAnimationFrame(detectHands);
        };

        

        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
                await initializeHandDetection();
            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        };

        startWebcam();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
            if (handLandmarker) {
                handLandmarker.close();
            }
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);

    const detectionFunc = () => {

        if (latestDetection) {

         console.log(
            latestDetection.worldLandmarks[0][5]
         )


        }
        else {
            console.log("No hand detection vals")
        }
        
    }



    
    return (
        <>
        <h1>Is there a Hand? {handPresence ? "Yes" : "No"}</h1>
        <button onClick={detectionFunc}>detect hand</button>
        <div style={{ position: "relative" }}>
            <video ref={videoRef} autoPlay playsInline style={{transform: "scaleX(-1)"}}></video>
            <canvas ref={canvasRef} style={{ backgroundColor: "black" , width:"600px", height:"480px"}}></canvas>
        </div>
    </>
    );
};

export default Demo;


// const motionSigns = () => {


//   const videoRef = useRef(null)

//   // const modelPath = '/models/hand_landmarker.task';

//   const gestureDetect = async () => {


//     const processResult = (result) => {
//       if (!result.gestures || result.gestures.length === 0) return;

//       const topGesture = result.gestures[0][0]

//       console.log(`Detected gesture: ${topGesture.categoryName}`)
//     }

//     // Create task for image file processing:
//     const vision = await FilesetResolver.forVisionTasks(
//       // path/to/wasm/root
//       "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm "
//     );
//     const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
//       baseOptions: {
//         modelAssetPath: "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task"
//       },
//       numHands: 1
//     });

//     await gestureRecognizer.setOptions({ runningMode: "VIDEO" });

//     let lastVideoTime = -1

//     function renderLoop(): void {
//       const video = videoRef.current?.video
//       if (video.currentTime !== lastVideoTime) {
//         const gestureRecognitionResult = gestureRecognizer.recognizeForVideo(video, performance.now())
//         processResult(video)
//         lastVideoTime
//       }

//       requestAnimationFrame(renderLoop)

//       // requestAnimationFrame(() => {
//       //   renderLoop();
//       // })

//     }

//     renderLoop();

//   }

//   gestureDetect();
//   return (<Webcam ref={videoRef} style={{ transform: "scaleX(-1)" }} />)
// }










// export default motionSigns;
// const videoFrame = videoRef.current.video
// const videoHeight = "360px";
// const videoWidth = "480px";


// const handLandmarker = await HandLandmarker.createFromOptions(
//   filesetResolver,
//   {
//     baseOptions: {
//       modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
//       delegate: "GPU"
//     },
//     runningMode: "VIDEO",
//     numHands: 2
//   }
// );





// const detectGesture = () => {

//   let gestureRecognizer: GestureRecognizer;


//   const videoRef = useRef(null)

//   const gestureOutputRef = useRef(null)
//   const [webcamRunning, setWebcamRunning] = useState(false);

//   const canvasElement = document.getElementById("output_canvas");


//   const video = videoRef.current
//   const videoHeight = "360px";
//   const videoWidth = "480px";

//   const canvasCtx = canvasElement.getContext('2d')




//   // const video = document.getElementById("webcam");
//   // const canvasElement = document.getElementById("output_canvas");
//   // const canvasCtx = canvasElement.getContext("2d");
//   // const gestureOutput = document.getElementById("gesture_output");

//   // Check if webcam access is supported.
//   function hasGetUserMedia() {
//     return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
//   }

//   // If webcam supported, add event listener to button for when user
//   // wants to activate it.
//   // if (hasGetUserMedia()) {
//   //   enableWebcamButton = document.getElementById("webcamButton");
//   //   enableWebcamButton.addEventListener("click", enableCam);
//   // } else {
//   //   console.warn("getUserMedia() is not supported by your browser");
//   // }

//   // Enable the live webcam view and start detection.


//   const createGestureRecognizer = async () => {
//     const vision = await FilesetResolver.forVisionTasks(
//       "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
//     );
//     const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
//       baseOptions: {
//         modelAssetPath:
//           "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
//         delegate: "GPU"
//       },
//       runningMode: "VIDEO"
//     });



//     createGestureRecognizer();
//     function enableCam(event) {
//       if (!gestureRecognizer) {
//         alert("Please wait for gestureRecognizer to load");
//         return;
//       }

//       if (webcamRunning === true) {
//         setWebcamRunning(false)
//         // enableWebcamButton.innerText = "ENABLE PREDICTIONS";
//       } else {
//         setWebcamRunning(true)
//         // enableWebcamButton.innerText = "DISABLE PREDICTIONS";
//       }

//       // getUsermedia parameters.
//       const constraints = {
//         video: true
//       };

//       // Activate the webcam stream.
//       navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
//         video.srcObject = stream;
//         video.addEventListener("loadeddata", predictWebcam);
//       });
//     }

//     let lastVideoTime = -1;
//     let results = undefined;
//     async function predictWebcam() {
//       const webcamElement = document.getElementById("webcam");
//       // Now let's start detecting the stream.

//       let runningMode = "VIDEO";
//       await gestureRecognizer.setOptions({ runningMode: "VIDEO" });

//       let nowInMs = Date.now();
//       if (video.currentTime !== lastVideoTime) {
//         lastVideoTime = video.currentTime;
//         results = gestureRecognizer.recognizeForVideo(video, nowInMs);
//       }

//       canvasCtx.save();
//       canvasCtx.clearRect(0, 0, canvasElement.current.width, canvasElement.current.height);
//       const drawingUtils = new DrawingUtils(canvasCtx);


//       canvasElement.current.style.height = videoHeight;
//       webcamElement.style.height = videoHeight;
//       canvasElement.current.style.width = videoWidth;
//       webcamElement.style.width = videoWidth;

//       if (results.landmarks) {
//         for (const landmarks of results.landmarks) {
//           drawingUtils.drawConnectors(
//             landmarks,
//             GestureRecognizer.HAND_CONNECTIONS,
//             {
//               color: "#00FF00",
//               lineWidth: 5
//             }
//           );
//           drawingUtils.drawLandmarks(landmarks, {
//             color: "#FF0000",
//             lineWidth: 2
//           });
//         }
//       }


//       const gestureOutput = gestureOutputRef.current;

//       canvasCtx.restore();
//       if (results.gestures.length > 0) {
//         gestureOutput.style.display = "block";
//         gestureOutput.style.width = videoWidth;
//         const categoryName = results.gestures[0][0].categoryName;
//         const categoryScore = parseFloat(
//           (results.gestures[0][0].score * 100).toString()
//         ).toFixed(2);
//         const handedness = results.handednesses[0][0].displayName;
//         gestureOutput.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}`;
//       } else {
//         gestureOutput.style.display = "none";
//       }
//       // Call this function again to keep predicting when the browser is ready.
//       if (webcamRunning === true) {
//         window.requestAnimationFrame(predictWebcam);
//       }
//     }
//   }

//   return (
//     <div>
//     <Webcam ref={videoRef}/>
//     <canvas id="output_canvas"/>
//     </div>
//   )

// }

// export default detectGesture;

// const detect = () => {
//   handLandmarker.detectForVideo(video, performance.now())
//   requestAnimationFrame(detect)
// };

// detect()