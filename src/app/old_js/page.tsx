"use client";

// import React, { useEffect, useRef, useState } from "react";
// import {
//   FilesetResolver,
//   HandLandmarker,
//   GestureRecognizer,
//   DrawingUtils,
// } from "@mediapipe/tasks-vision";
// import Webcam from "react-webcam";

// detection.landmark_idx.globallandmarks.landmarkcoor

import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import * as fp from "fingerpose";
import fsl_gestures from "../../components/generateSigns";
import Webcam from "react-webcam";

import { RiCameraFill, RiCameraOffFill } from "react-icons/ri";

import {
  Text,
  Heading,
  Button,
  Image,
  Stack,
  Container,
  Box,
  VStack,
  ChakraProvider,
} from "@chakra-ui/react";

import { Signimage, Signpass } from "../../components/handimage";

const Demo = () => {
  // let [idx,setIdx] = useState(0)
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const tutorTextRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [gameState, setGameState] = useState("started");
  const handLandmarkerRef = useRef(null);
  // const [currDetections, setCurrDetections] = useState(null);

  // const [handPresence, setHandPresence] = useState(null);
  // const [latestDetection, setLatestDetection] = useState(null);
  // const [prevHandCoord, setPrevHandCoord] = useState({});
  // const [currHandCoord, setCurrHandCoord] = useState({});
  // const [coordDeltaVals, setCoordDeltaVals] = useState({});
  // const [stateTest, setstateTest] = useState({})
  const [camState, setCamState] = useState("on");
  const [sign, setSign] = useState(null);
  const [messageBody, setMessageBody] = useState("");

  const hand_landmarker_task = "/models/hand_landmarker.task";

  let signList = [];
  let currentSign = 0;

  let handLandmarker;
  let animationFrameId;

  const initializeHandDetection = async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: hand_landmarker_task },
        numHands: 1,
        runningMode: "VIDEO",
      });
      handLandmarkerRef.current = handLandmarker

      detect(handLandmarkerRef.current);
      
    } catch (error) {
      console.error("Error initializing hand detection:", error);
    }
  };

  const landmarker = handLandmarkerRef.current

  const runHandpose = async () => {
    const detections = await landmarker.detectForVideo(
      videoRef.current,
      performance.now()
    );
    _signList();

    setInterval(() => {
      detect(landmarker);
    }, 1000);
  };
  const _signList = () => {
    signList = generateSigns();
  };

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function generateSigns() {
    const password = shuffle(Signpass);
    return password;
  }

  const detect = async (landmarker) => {
    // if (videoRef.current && videoRef.current.readyState >= 2) {
    if (
      typeof videoRef.current !== "undefined" &&
      videoRef.current !== null &&
      videoRef.current.video.readyState === 4
    ) {
      const video = videoRef.current.video;
      const videoWidth = videoRef.current.video.videoWidth;
      const videoHeight = videoRef.current.video.videoHeight;

      videoRef.current.video.width = videoWidth;
      videoRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // /** @type {import("@mediapipe/tasks-vision").HandLandmarkerResult} */
      // const detections = await handLandmarker.detectForVideo(
      //   videoRef.current,
      //   performance.now()
      // );

      // setHandPresence(detections.handedness.length > 0);
      // setLatestDetection(detections)

      // Assuming detections.landmarks is an array of landmark objects
      if (detectionsRef.current.landmarks) {
        // drawLandmarks(detections.landmarks);
        const GE = new fp.GestureEstimator(fsl_gestures);
        const estimatedGestures = await GE.estimate(detectionsRef.current.landmarks, 6.5);

        if (gameState === "started") {
          titleRef.current.innerText =
            "Make a 👍 gesture with your hand to start";
        }

        if (
          estimatedGestures.gestures !== undefined &&
          estimatedGestures.gestures.length > 0
        ) {
          const confidence = estimatedGestures.gestures.map(
            (gest) => gest.score
          );

          const maxConfidence = confidence.indexOf(
            Math.max.apply(undefined, confidence)
          );

          if (
            estimatedGestures.gestures[maxConfidence].name === "thumbs_up" &&
            gameState !== "played"
          ) {
            _signList();
            setGameState("played");
            imageRef.current.classList.add("play");
            tutorTextRef.current.innerText =
              "make a hand gesture based on letter shown below";

            // doc.getElementById
            // doc query querySelector
          } else if (gameState === "played") {
            titleRef.current.innerText = "";

            if (currentSign === signList.length) {
              _signList();
              currentSign = 0;
              return;
            }

            if (
              typeof signList[currentSign].src.src === "string" ||
              signList[currentSign].src.src instanceof String
            ) {
              imageRef.current.setAttribute(
                "src",
                signList[currentSign].src.src
              );

              if (
                signList[currentSign].alt ===
                estimatedGestures.gestures[maxConfidence].name
              ) {
                currentSign++;
              }
              let currLetter = estimatedGestures.gestures[maxConfidence].name;
              setSign(currLetter);

              if (currLetter !== "thumbs_up") {
                setMessageBody((messageBody) => messageBody + currLetter);
              }
            }
          } else if (gameState === "finished") {
            return;
          }
        }

        // if (gamestate === "started") {

        // }
      }
      // const ctx
      // drawhand...
    }
  };
  /// useEffect
  // requestAnimationFrame(detectHands);

  useEffect(() => {
    runHandpose();
  }, []);

  const turnOffCamera = () => {
    if (camState === "on") {
      setCamState("off");
    } else {
      setCamState("on");
    }
  };

  return (
    <ChakraProvider>
      <Box bgColor="#5784BA">
        <Container centerContent maxW="xl" height="100vh" pt="0" pb="0">
          <VStack spacing={4} align="center">
            <Box h="20px"></Box>
            <Heading
              as="h3"
              size="md"
              className="tutor-text"
              color="white"
              textAlign="center"
            ></Heading>
            <Box h="20px"></Box>
          </VStack>

          <Heading
            as="h1"
            size="lg"
            id="app-title"
            ref={titleRef}
            color="white"
            textAlign="center"
          >
            🧙‍♀️ Loading the Magic 🧙‍♂️
          </Heading>

          <Box id="webcam-container">
            {camState === "on" ? (
              <Webcam
                id="webcam"
                ref={videoRef}
                style={{ transform: "scaleX(-1)" }}
              />
            ) : (
              <div id="webcam" style={{ color: "black" }}></div>
            )}

            {sign ? (
              <div
                style={{
                  position: "absolute",
                  marginLeft: "auto",
                  marginRight: "auto",
                  right: "calc(50% - 50px)",
                  bottom: 100,
                  textAlign: "center",

                  //  textAlign: "-webkit-center",
                }}
              >
                <Text color="white" fontSize="sm" mb={1}>
                  detected gestures
                </Text>
                <Text>{messageBody}</Text>
                <img
                  alt="signImage"
                  src={
                    Signimage[sign]?.src
                      ? Signimage[sign].src
                      : "/loveyou_emoji.svg"
                  }
                  style={{
                    height: 30,
                  }}
                />
              </div>
            ) : (
              " "
            )}
          </Box>

          <canvas id="gesture-canvas" ref={canvasRef} style={{}} />

          <Box
            id="singmoji"
            style={{
              zIndex: 9,
              position: "fixed",
              top: "50px",
              right: "30px",
            }}
          ></Box>

          <Image h="150px" objectFit="cover" id="emojimage" />
          {/* <pre className="pose-data" color="white" style={{position: 'fixed', top: '150px', left: '10px'}} >Pose data</pre> */}
        </Container>

        <Stack id="start-button" spacing={4} direction="row" align="center">
          <Button
            leftIcon={
              camState === "on" ? (
                <RiCameraFill size={20} />
              ) : (
                <RiCameraOffFill size={20} />
              )
            }
            onClick={turnOffCamera}
            colorScheme="orange"
          >
            Camera
          </Button>
        </Stack>
      </Box>
    </ChakraProvider>
  );
};

export default Demo;

// const drawLandmarks = (landmarksArray) => {
//   const canvas = canvasRef.current;
//   const ctx = canvas.getContext("2d");
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.fillStyle = "white";

//   landmarksArray.forEach((landmarks) => {
//     landmarks.forEach((landmark) => {
//       const x = landmark.x * canvas.width;
//       const y = landmark.y * canvas.height;

//       ctx.beginPath();
//       ctx.arc(x, y, 5, 0, 2 * Math.PI); // Draw a circle for each landmark
//       ctx.fill();
//     });
//   });
// };

// const startWebcam = async () => {
//     try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         videoRef.current.srcObject = stream;
//         await initializeHandDetection();
//     } catch (error) {
//         console.error("Error accessing webcam:", error);
//     }
// };

// startWebcam();

// return () => {
//     if (videoRef.current && videoRef.current.srcObject) {
//         videoRef.current.srcObject.getTracks().forEach(track => track.stop());
//     }
//     if (handLandmarker) {
//         handLandmarker.close();
//     }
//     if (animationFrameId) {
//         cancelAnimationFrame(animationFrameId);
//     }
// };
// }, []);

// const logHands = async () => {
//        const [prevHandCoord, setPrevHandCoord] = useState({});
// const [currHandCoord, setCurrHandCoord]

// if (latestDetection) {

//       const zWristPoints = {

//       "yPoint1": 0.07532834261655807,

//       "yPoint2": 0.06799570471048355,

//       "yPoint3": 0.04702074080705643,

//       "ypoint4": 0.05103735998272896

//       }

//           Object.values(latestDetection.worldLandmarks).forEach((lmVal) => {

//               console.log(lmVal[20])
//           })

//  Object.values(latestDetection.worldLandmarks).forEach((lmVal) => {

//     Object.values(lmVal).slice(0,3).forEach((indexTip) => {

//         const coordList = {}
//         let coordIdx = 1

//     Object.entries(indexTip).slice(0,3).forEach(([coordName,coordVal]) => {

//         coordList[coordName + coordIdx] = coordVal
//     })
//     const prevHandObjLen = Object.keys(prevHandCoord).length

//       if (prevHandObjLen < 3) {
//         setPrevHandCoord(coordList)
//     }
//     else {
//         setCurrHandCoord(coordList)
//     }

//     const deltaVals = Object.values(prevHandCoord).map((prevCoord,idx) => {
//         const currCoord = Object.values(currHandCoord)[idx]
//             return (currCoord - prevCoord)
//         })

//     if (!deltaVals.includes(NaN)) {
//     let i = 5
//     }

//     })

// })

// setPrevHandCoord({
//     ...prevHandCoord,
//     [coordName + 1]: coordVal
// })

// setPrevHandCoord({
//     ...prevHandCoord,
//     x1 : coordVal,
//     y1 :

// currCoord.set(coordName,coordVal)

// console.log(latestDetection.worldLandmarks[0].slice(7,9).slice(0,2))

//  {sign ? (
//               <div
//                 style={{
//                   position: "absolute",
//                   marginLeft: "auto",
//                   marginRight: "auto",
//                   right: "calc(50% - 50px)",
//                   bottom: 100,
//                   textAlign: "-webkit-center",
//                 }}
//               >
//                 <Text color="white" fontSize="sm" mb={1}>
//                   detected gestures
//                 </Text>
//                 <Text>{messageBody}</Text>
//                 <img
//                   alt="signImage"
//                   src={
//                     Signimage[sign]?.src
//                       ? Signimage[sign].src
//                       : "/loveyou_emoji.svg"
//                   }
//                   style={{
//                     height: 30,
//                   }}
//                 />
//               </div>
//             ) : (
//               " "
//             )}
//  <Button onClick={() => gestureFunc()}>title</Button>
//  <>
//     <h1>Is there a Hand? {handPresence ? "Yes" : "No"}</h1>
//     <button onClick={logHands}>detect hand</button>
//     <div style={{ position: "relative" }}>
//         <video ref={videoRef}  autoPlay playsInline style={{transform: "scaleX(-1)"}}></video>
//         <canvas ref={canvasRef} style={{ backgroundColor: "black" , width:"600px", height:"480px"}}></canvas>
//     </div>
// </>

//     const detectionFunc = () => {

//         // motionVals.landmarkMotions[0]

//         // motionVals[0].landmarkMotions[0].landmarkIndex

//         motionVals[0].letter
//         motionVals[0].landmarkMotions

//     motionVals.forEach((letterVal) => {

//         const letter = letterVal.letter

//         Object.values(letterVal.landmarkMotions).forEach((landmarkVal) => {

//             Object.values(landmarkVal.positions).forEach((coordName) => {
//                 console.log(Object.values(coordName))
//               })

//         })

//     } )

//     // Object.values(motionVals).forEach((letter) => {

//     //     Object.entries(letter).forEach(([letter, letterVal]) => {

//     //         console.log(letterVal[0])

//     //     })

//     // })
//         // const coords = motionVals[0].landmarkMotions[0].positions[0]
//         // const landmarks = detections.globalLandmarks

//         // Object.values(coords).forEach((val) => {

//         //     let i =5

//         // })

//         // json structure = motionVals.letter.pos.landmark.coord

// //     for (const [index, element] of coords.entries()) {
// //         console.log(index, element);
// // }

//         // motionVals[0].landmarkMotions[0].positions
//         // motionVals[0].landmarkMotions[0].landmarkIndex
//         // motionVals[0].letter
//         // motionVals[0].landmarkMotions

//         // let idx = 0;

//         // const motionsArr = motionVals[idx].landmarkMotions[idx]

//         // for (let motion of motionsArr)
//         // {
//         //     idx++
//         // }
//         // console.log(idx)

//         // Object.values(motionVals).forEach(([val1,val2]) => {
//         //     console.log(val1,val2)
//         // })

//         // Object.entries(motionVals).forEach(([letter, letterProps]) => {

//         // Object.values(letterProps).forEach(([newProps, newProps2])=> {
//         //     console.log(newProps,newProps2)
//         // })

//         // })

//         //  if (latestDetection) {

//         //    Object.entries(latestDetection.worldLandmarks[0]).forEach(([lm,coord]) => {

//         //     console.log(lm)
//         //      Object.entries(coord).slice(0,3).forEach(([coordName,coordVal]) => {
//         //         console.log(coordName, ": ", coordVal)
//         //      })

//         //     })

//             //   latestDetection.worldLandmarks.forEach((val,idx) => {

//             //     // Object.entries(coord).forEach((coordVals, idx) => {
//             //     //     console.log(coordVals)
//             //     //   })

//             //    })
//             // })

//             // let indices = motionVals[0].landmarkMotions[0].landmarkIndex

//             // console.log(indices)

//             // motionVals.forEach((val, idx) => {

//             //     const landmarkvals = val.landmarkMotions
//             //     landmarkvals.forEach((newval, newidx) => {

//             //         console.log(val.letter, newval.landmarkIndex)
//             //     })
//             // })

//             // latestDetection.worldLandmarks[0].forEach((val, coord)=> {

//             //     const landmarkVals = motionVals[0]

//             //     })

//         //     // motionVals[0].landmarkMotions[0].positions[0].x

//         //         // Object.values(motionVals.J.firstPosition[17].x).forEach((x) => {
//         //         //     console.log(x)
//         //         // })

//         }
//         // else {
//         //     console.log("No hand detection vals")
//         // }

// // }

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

// import React, { useRef, useState, useEffect } from "react"
// import * as tf from "@tensorflow/tfjs"
// import * as fp from "fingerpose"
// import * as handpose from "@tensorflow-models/handpose"
// import { FilesetResolver, HandLandmarker, GestureRecognizer} from "@mediapipe/tasks-vision";
// import Webcam from "react-webcam"
// import { drawHand } from "../components/handposeutil"
// import Handsigns from "../components/handsigns"
// import fsl_gestures from "../components/generateSigns"

// import {
//   Text,
//   Heading,
//   Button,
//   Image,
//   Stack,
//   Container,
//   Box,
//   VStack,
//   ChakraProvider,
// } from "@chakra-ui/react"

// import { Signimage, Signpass } from "../components/handimage"

// import About from "../components/about"
// import Metatags from "../components/metatags"

// // import "../styles/App.css"

// // import "@tensorflow/tfjs-backend-webgl"

// import { RiCameraFill, RiCameraOffFill } from "react-icons/ri"

// export default function Home() {
//   const videoRef = useRef(null)
//   const canvasRef = useRef(null)
//   const [messageBody, setMessageBody] = useState("")
//   const [gestureData, setGestureData] = useState(null)
//   const [gestureDetect,setGestureDetect] = useState(null)
//   const [lastVideoTime, setLastVideoTime] = useState(-1)
//   const [gestureFunc, setGestureFunc] = useState(() => () => {
//     console.log("no gesture set yet")
//   })

//   const [camState, setCamState] = useState("on")

//   const [sign, setSign] = useState(null)

//   let signList = []
//   let currentSign = 0

//   let gamestate = "started"

// let net;

//   async function runHandpose() {

//     const vision = await FilesetResolver.forVisionTasks(
//     "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm",
// );
//   const gestureRecognizer = await GestureRecognizer.createFromModelPath(vision,
//     "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task"
// );

// await gestureRecognizer.setOptions({runningMode: "VIDEO"})

// setGestureDetect(gestureRecognizer)

// detect();

// // const image = document.getElementById("image");
// // const recognitions = gestureRecognizer.recognize();

//     // const net = await handpose.load()

//     _signList()

//     // window.requestAnimationFrame(loop);

//     setInterval(() => {
//       detect(gestureDetect)
//     }, 1000)
//   }

//   function _signList() {
//     signList = generateSigns()
//   }

//   function shuffle(a) {
//     for (let i = a.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1))
//       ;[a[i], a[j]] = [a[j], a[i]]
//     }
//     return a
//   }

//   function generateSigns() {
//     const password = shuffle(Signpass)
//     return password
//   }

//   async function detect() {
//     // Check data is available
//     if (
//       typeof videoRef.current !== "undefined" &&
//       videoRef.current !== null &&
//       videoRef.current.video.readyState === 4
//     ) {
//       // Get Video Properties
//       const video = videoRef.current.video
//       const videoWidth = videoRef.current.video.videoWidth
//       const videoHeight = videoRef.current.video.videoHeight

//       // Set video width
//       videoRef.current.video.width = videoWidth
//       videoRef.current.video.height = videoHeight

//       // Set canvas height and width
//       canvasRef.current.width = videoWidth
//       canvasRef.current.height = videoHeight

//       // Make Detections
//       gestureRecognize
//       const hand = gestureDetect.recognizeForVideo(video)
//       gestureRe
//       // const hand = await net.estimateHands(video)

//       if (hand.length > 0) {
//         //loading the fingerpose model
//         const GE = new fp.GestureEstimator(fsl_gestures)

//         const estimatedGestures = await GE.estimate(hand[0].landmarks, 6.5)
//         // document.querySelector('.pose-data').innerHTML =JSON.stringify(estimatedGestures.poseData, null, 2);

//         // console.log(estimatedGestures.poseData)

//         if (gamestate === "started") {
//           document.querySelector("#app-title").innerText =
//             "Make a 👍 gesture with your hand to start"
//         }

//         if (
//           estimatedGestures.gestures !== undefined &&
//           estimatedGestures.gestures.length > 0
//         ) {
//           const confidence = estimatedGestures.gestures.map(p => p.confidence)
//           const maxConfidence = confidence.indexOf(
//             Math.max.apply(undefined, confidence)
//           )

//           //setting up game state, looking for thumb emoji
//           if (
//             estimatedGestures.gestures[maxConfidence].name === "thumbs_up" &&
//             gamestate !== "played"
//           ) {
//             _signList()
//             gamestate = "played"
//             document.getElementById("emojimage").classList.add("play")
//             document.querySelector(".tutor-text").innerText =
//               "make a hand gesture based on letter shown below"
//           } else if (gamestate === "played") {
//             document.querySelector("#app-title").innerText = ""

//             //looping the sign list
//             if (currentSign === signList.length) {
//               _signList()
//               currentSign = 0
//               return
//             }

//             // console.log(signList[currentSign].src.src)

//             //game play state

//             if (
//               typeof signList[currentSign].src.src === "string" ||
//               signList[currentSign].src.src instanceof String
//             ) {
//               document
//                 .getElementById("emojimage")
//                 .setAttribute("src", signList[currentSign].src.src)
//               if (
//                 signList[currentSign].alt ===
//                 estimatedGestures.gestures[maxConfidence].name
//               ) {
//                 currentSign++
//               }
//               setSign(estimatedGestures.gestures[maxConfidence].name)

//               let currLetter = estimatedGestures.gestures[maxConfidence].name
//               let gestureProps = estimatedGestures.poseData

//               setGestureFunc(() => () => {
//                 console.log(gestureProps)
//               })

//               if (currLetter !== "thumbs_up") {
//                 setMessageBody(messageBody => messageBody + currLetter)
//               }
//             }
//           } else if (gamestate === "finished") {
//             return
//           }
//         }
//       }
//       // Draw hand lines
//       const ctx = canvasRef.current.getContext("2d")
//       drawHand(hand, ctx)
//     }
//   }

//   //   if (sign) {
//   //     console.log(sign, Signimage[sign])
//   //   }

//   useEffect(() => {
//     runHandpose()
//   }, [])

//   const turnOffCamera = () => {
//     if (camState === "on") {
//       setCamState("off")
//     } else {
//       setCamState("on")
//     }
//   }

//   const testFunc = () => {
//     console.log("test")
//   }

//   return (
//     <ChakraProvider>
//       <Metatags />
//       <Box bgColor="#5784BA">
//         <Container centerContent maxW="xl" height="100vh" pt="0" pb="0">
//           <VStack spacing={4} align="center">
//             <Box h="20px"></Box>
//             <Heading
//               as="h3"
//               size="md"
//               className="tutor-text"
//               color="white"
//               textAlign="center"
//             ></Heading>
//             <Box h="20px"></Box>
//           </VStack>

//           <Heading
//             as="h1"
//             size="lg"
//             id="app-title"
//             color="white"
//             textAlign="center"
//           >
//             🧙‍♀️ Loading the Magic 🧙‍♂️
//           </Heading>

//           <Box id="webcam-container">
//             {camState === "on" ? (
//               <Webcam id="webcam" ref={videoRef} />
//             ) : (
//               <div id="webcam" background="black"></div>
//             )}

//             {sign ? (
//               <div
//                 style={{
//                   position: "absolute",
//                   marginLeft: "auto",
//                   marginRight: "auto",
//                   right: "calc(50% - 50px)",
//                   bottom: 100,
//                   textAlign: "-webkit-center",
//                 }}
//               >
//                 <Text color="white" fontSize="sm" mb={1}>
//                   detected gestures
//                 </Text>
//                 <Text>{messageBody}</Text>
//                 <img
//                   alt="signImage"
//                   src={
//                     Signimage[sign]?.src
//                       ? Signimage[sign].src
//                       : "/loveyou_emoji.svg"
//                   }
//                   style={{
//                     height: 30,
//                   }}
//                 />
//               </div>
//             ) : (
//               " "
//             )}
//           </Box>

//           <canvas id="gesture-canvas" ref={canvasRef} style={{}} />

//           <Box
//             id="singmoji"
//             style={{
//               zIndex: 9,
//               position: "fixed",
//               top: "50px",
//               right: "30px",
//             }}
//           ></Box>

//           <Image h="150px" objectFit="cover" id="emojimage" />
//           {/* <pre className="pose-data" color="white" style={{position: 'fixed', top: '150px', left: '10px'}} >Pose data</pre> */}
//         </Container>

//         <Stack id="start-button" spacing={4} direction="row" align="center">
//           <Button
//             leftIcon={
//               camState === "on" ? (
//                 <RiCameraFill size={20} />
//               ) : (
//                 <RiCameraOffFill size={20} />
//               )
//             }
//             onClick={turnOffCamera}
//             colorScheme="orange"
//           >
//             Camera
//           </Button>

//           <Button onClick={() => gestureFunc()}>title</Button>
//           <About />
//         </Stack>
//       </Box>
//     </ChakraProvider>
//   )
// }
