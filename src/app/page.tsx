'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import * as fp from 'fingerpose';
import { MSLGestArray, ASLGestArray } from '../../components/generateSigns';
import drawLandmarks from './gestureDetection/drawLandmarks';
import detectStaticSigns from './gestureDetection/detectStaticSigns';
import { detectMotionSigns } from './gestureDetection/detectMotionSigns';
import motionShapes from '../app/motionShapes.json';

const Demo = () => {

 
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const landmarkDetect = useRef(null);
  
  const jPoints = useRef({
   x: [],
   y: []
  })

  const staticLetter = useRef<string>('');
  const fingerPoseLetter = useRef(null);
  const motionLetter = useRef(null);
  const animationId = useRef(null);
  const landmarkBuffer = useRef([])

  const motionGesturePt = useRef({
    J: null,
    Z: null
  });


  const [ASLMode, setASLMode] = useState(true);
  const useASL = useRef(true);
  const [languageArray,setLanguageArray] = useState(ASLGestArray)
  const languageArrayRef = useRef(ASLGestArray)
  const [motionEnabled, setMotionEnabled] = useState(false);
  const motionEnabledRef = useRef(false);
  
  const landmarksRef = useRef(null);
  const fingerTipsRef = useRef({
    thumbTip: null,
    indexTip: null,
    middleFingerTip: null,
    pinkyTip: null,

  });
  const [messageBody, setMessageBody] = useState('');
  const animationRef = useRef(null);

  const pixelValsRef = useRef(null);

  
  // const landmarkTips = useRef({
  //   indexTip: null,
  //   pinkyTip: null
  // })

  const [appTitle, setAppTitle] = useState<String | null>(
    'American Sign Language'
  );

  const [subHeading, setSubHeading] = useState('Static');

  // const [messageBody, setMessageBody] = useState('')
  // const { messageBody, setMessageBody } = useContext(messageContext);

  const hand_landmarker_task = '/models/hand_landmarker.task';

  let animationFrameId;
  let videoFrameID;
  const video = videoRef.current;



  useEffect(() => {
    if (ASLMode) {
      setAppTitle('American Sign Language');
      
     
   
    } else {
      setAppTitle('Mexican Sign Language');
     
     
    
    }
    setMessageBody('')

  }, [ASLMode]);



 
  useEffect(() => {
    motionEnabledRef.current = motionEnabled;
  }, [motionEnabled]);

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
        // detectHands();
      } catch (error) {
        console.error('Error initializing hand detection:', error);
      }
      // animationFrameId = requestAnimationFrame(initializeHandDetection);
      // videoFrameID = video.requestVideoFrameCallback(initializeHandDetection);
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
        video.cancelVideoFrameCallback(videoFrameID);
        // cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const rafInterval = (callback, interval) => {
    let start = performance.now();
    const loop = (now) => {

      // useASL.current ? setLanguageArray(MSLGestArray) : setLanguageArray(ASLGestArray)

      if (!motionEnabledRef.current && now - start >= interval) {
        callback();
        start = now;
      }

      if (motionEnabledRef.current) {
        cancelAnimationFrame(animationRef.current);
        staticLetter.current = ''
        

        // animationRef.current = null;
      }

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
  };

useEffect(() => {
  setLanguageArray(useASL.current ? MSLGestArray : ASLGestArray);
}, [ASLMode]);



  useEffect(() => {


    const detectLandmarks = () => {
      if (
        videoRef.current &&
        videoRef.current.readyState === 4 &&
        landmarkDetect.current
      ) {
        const handLandmarker = landmarkDetect.current;
        const results = handLandmarker.detectForVideo(
          videoRef.current,
          performance.now()
        );

        landmarksRef.current = results.landmarks[0];

     

        if (landmarksRef.current && landmarksRef.current.length > 0) {
          const canvas = canvasRef.current;
          const canvasWidth = canvas.clientWidth;
          const canvasHeight = canvas.clientHeight;

          const pixelVals = landmarksRef.current.map(({ x, y, z }) => [
            x * canvasWidth,
            y * canvasHeight,
            z,
          ]);

          pixelValsRef.current = pixelVals;

          fingerTipsRef.current = {
            thumbTip: landmarksRef.current[4],
            indexTip: landmarksRef.current[8],
            middleFingerTip: landmarksRef.current[12],
            pinkyTip: landmarksRef.current[20],
          };
        }
      }

    };


    

    const motionSigns = () => {
       if (!motionEnabledRef.current) {
          cancelAnimationFrame(animationId.current)
        }

      detectLandmarks();
      if (landmarksRef.current && landmarksRef.current.length > 0) {
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






        if (landmarkBuffer.current.length >= 2) {
          const x1: any = landmarkBuffer.current[0].x;
          const y1 = landmarkBuffer.current[0].y;
          const x2: any = landmarkBuffer.current.at(-1).x;
          const y2 = landmarkBuffer.current.at(-1).y;
     
     

          setTimeout(() => {
         
            if (x2 > 0.6 && y2 < 5 && motionGesturePt.current.Z=== null) {
              motionGesturePt.current.Z= 'gestureStart'
              console.log("Z Start")
            }
              
              if (x2 < 0.5 && y2 < 5 && motionGesturePt.current.Z=== 'gestureStart') {
                motionGesturePt.current.Z= 'firstGesture';
                 console.log("first z point")
                landmarkBuffer.current = [];
              }
          
          }, 300);

          setTimeout(() => {
            if (x2 < 0.7 && y2 > 0.7 && motionGesturePt.current.Z=== "firstGesture") {
                motionGesturePt.current.Z= 'secondGesture';
                console.log("second z point")
                 landmarkBuffer.current = [];
            }
          }, 100);

          setTimeout(() => {
            if (x2 < 0.5 && motionGesturePt.current.Z=== 'secondGesture' ) {
                motionGesturePt.current.Z= 'thirdGesture';
                console.log("third z point")
                setMessageBody((msg) => msg + "Z")
                landmarkBuffer.current = [];
            }
          }, 100);

        }
      

            //  if (motionLetter.current === "Z" && fingerTipsRef.current) {
              
            //   zCoords.current.x.push(fingerTipsRef.current.indexTip.x)
            //    zCoords.current.y.push(fingerTipsRef.current.indexTip.y)

            //    const xPt = zCoords.current.x
            //    const yPt = zCoords.current.y

            //    console.log(Math.sqrt((xPt.at(-1) - xPt[0])**2 + (yPt.at(-1) - yPt[0]) ** 2))
            // }

            motionLetter.current = detectMotionSigns(
              fingerTipsRef,
              fingerPoseLetter,
              motionGesturePt,
              
            );

            console.log(motionLetter.current)
           
          }

     if (motionLetter.current === 'J' || motionLetter.current === 'Z') {
            setMessageBody((msg) => msg + motionLetter.current);
            motionLetter.current = ''
          }
        }
      }
      animationId.current = requestAnimationFrame(motionSigns);
    };

    animationId.current = requestAnimationFrame(motionSigns);

    const staticSigns = async () => {
      detectLandmarks();
      
      if (!videoRef.current || !canvasRef.current) {
        // requestAnimationFrame(staticSigns);
        return;
      }
     
      staticLetter.current = detectStaticSigns(ASLGestArray, pixelValsRef);

 
      
      const indexFingerTip = fingerTipsRef.current.indexTip  
      const middleFingerTip = fingerTipsRef.current.middleFingerTip
       const thumbTip = fingerTipsRef.current.thumbTip
      
   

      if (landmarksRef.current && staticLetter.current.length === 1) {

      


        if (indexFingerTip.x < middleFingerTip.x && staticLetter.current === "U") {
          setMessageBody((msg) => msg + "R");
        }

    
        else if (thumbTip.y - middleFingerTip.y < 0.05 && staticLetter.current === "E") {
           setMessageBody((msg) => msg + "S");
        }

        else if (indexFingerTip.x - middleFingerTip.x < 0.05 && staticLetter.current === "V") {
          setMessageBody((msg) => msg + "U");
        }
       
      
        // if (middleFingerTip.y )
        else {
          setMessageBody((msg) => msg + staticLetter.current);
        }
         staticLetter.current = ''
        }
      
    };

    if (!motionEnabledRef.current) {
      rafInterval(staticSigns, 300);
    
    }
    // rafInterval(motionSigns,500)

    return () => { cancelAnimationFrame(animationFrameId); 
      cancelAnimationFrame(animationRef.current)
      cancelAnimationFrame(animationId.current)
     }}
  );


  // const test = () => {
  //  console.log(fingerTipsRef.current.indexTip)
  //  requestAnimationFrame(test)
  // }
  //    requestAnimationFrame(test)
  // useEffect (() => {
  //    let animationFrame;

  //       const landmarkDraw = () => {
  //         if (!landmarksRef.current) {
  //           cancelAnimationFrame(animationFrame)
  //         }

  //     if (landmarksRef.current && landmarksRef.current.length > 0) {
  //       drawLandmarks(landmarksRef,canvasRef)
  //     }
  //     animationFrame = requestAnimationFrame(landmarkDraw)
  //   }
  //   animationFrame = requestAnimationFrame(landmarkDraw)
  // }, [])

  const gestureModeToggle = () => {
    setMotionEnabled((useMotion) => !useMotion);
    subHeading === 'Static' ? setSubHeading('Motion') : setSubHeading('Static');
  };

  const gestureLanguageToggle = () => {
    setASLMode((useASL) => !useASL);
  };
  //   const messageBody = useMessageBody((state) => state.messageBody)

  // const setMessage = useMessageBody((state) => state.appendMessage);

  // const clearMessage = () => {
  //   setMessage('')
  //   console.log(messageBody.length)
  // }

  const clearMessage = () => {
    setMessageBody('');
  };



  const zPoint = () => {
   
   const pinkyXPt =  fingerTipsRef.current.indexTip.x
   const pinkyYPt =  fingerTipsRef.current.indexTip.y  

   const xPoints = jPoints.current.x
   const yPoints = jPoints.current.y

   xPoints.push(pinkyXPt)
   yPoints.push(pinkyYPt)



   if (jPoints.current.x.length >= 2) {

    console.log(Math.sqrt((xPoints.at(-1) - xPoints[0]) ** 2 + (yPoints.at(-1) - yPoints[0]) ** 2))
    console.log((yPoints.at(-1) - yPoints[0]) / (xPoints.at(-1) - yPoints[0]))
   }
  }
  // }

  return (
    <>
      {/* 
      <button
        onClick={() => {
          // jRecognize();
        }}
      
        Detect Hand
      </button> */}
      <h1 style={{ textAlign: 'center' }}>{"American Sign Language"}</h1>
      <h2 style={{ textAlign: 'center' }}>
        {subHeading} Gesture Detection Enabled
      </h2>
      <button onClick={gestureLanguageToggle}>Toggle Language</button>
      <button onClick={gestureModeToggle}>Toggle Gesture Mode</button>
      <button onClick={clearMessage}>Clear Message</button>
      <button onClick={zPoint}>Z-Tip</button>
      {/* <button onClick={deleteCharacter}>Backspace</button> */}

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

      <p style={{ textAlign: 'center', wordWrap: 'break-word' }}>
        {messageBody}
      </p>
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