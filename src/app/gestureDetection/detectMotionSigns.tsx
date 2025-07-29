import React, { useEffect, useRef, useState, useContext } from 'react';
import { messageContext } from '../messageContext';
import * as fp from 'fingerpose';
import { fingerTipsRef } from '../landmarkRefs';
import motionShapes from './motionShapes.json'
import { useMessageBody } from '../messageState'


export const createMotionLetters = (canvas,landmarksRef) => {

     const canvasWidth = canvas.clientWidth;
        const canvasHeight = canvas.clientHeight;

        const fingerTipRef = {

            indexTip: landmarksRef.current[0][8],
            pinkyTip: landmarksRef.current[0][20]
        }

    
      const pixelVals = landmarksRef.current.map(({ x, y, z }) => [
            x * canvasWidth,
            y * canvasHeight,
            z,
          ]);

        let letter: string;
           const validGestureShape = () => {
              let gestureArr = [];

              if (pixelVals) {
        Object.entries(motionShapes).forEach(([unicodeVal, props]) => {
    

          const newGesture = new fp.GestureDescription(unicodeVal);

          Object.entries(props.Curls).forEach(([fingerName, curlType]) => {
            const curlConfidence = props.curlConf[fingerName];
            newGesture.addCurl(
              fp.Finger[fingerName],
              fp.FingerCurl[curlType],
              1.0
            );
          });
          gestureArr.push(newGesture);
        });

        const GE = new fp.GestureEstimator(gestureArr);

        const est = GE.estimate(pixelVals, 8.0);

                if (est.gestures.length > 0) {
          let result = est.gestures.reduce((c1, c2) => {
            return c1.score > c2.score ? c1 : c2;
          });

          const currUnicode = result.name;
          letter = String.fromCharCode(
            parseInt(currUnicode.slice(1), 16)
          );

       
        }
      }
       return letter
    };
return validGestureShape()

}


export const detectMotionSigns = (letterRef,landmarksRef) => {

    const fingerTipVals = {
        indexTip: landmarksRef.current[0][8],
        pinkyTip: landmarksRef.current[0][20]
    }

      const coordRange = (val, min, max) => {
        return val >= min && val <= max;
      };

      let lastTime = Date.now();
      let gesturePt: string;

      const createMotionSign = () => {
        let indexFingerTip = fingerTipVals['indexTip'];
        let pinkyTip = fingerTipVals['pinkyTip'];
        const now = Date.now();

        if (pinkyTip && letterRef.current === 'J') {
          indexFingerTip = null
          const xPinky = pinkyTip['x'];
          const yPinky = pinkyTip['y'];
          if (
            coordRange(xPinky, 0, 0.46) &&
            coordRange(yPinky, 0.08, 1.0) &&
            gesturePt === null
          ) {
            gesturePt = 'firstJ';
            lastTime = now;
            console.log('First J point hit');
          }
          if (
            coordRange(xPinky, 0, 0.46) &&
            coordRange(yPinky, 0.25, 1.0) &&
            gesturePt === 'firstJ'
          ) {
            gesturePt = 'secondJ';
            lastTime = now;
            console.log('Second J point hit');
          }
          if (
            coordRange(xPinky, 0, 0.61) &&
            coordRange(yPinky, 0.35, 1.0) &&
            gesturePt === 'secondJ'
          ) {
            gesturePt = 'thirdJ';
            lastTime = now;
            console.log('Third J point hit');
          }
          if (
            coordRange(xPinky, 0.39, 1.0) &&
            coordRange(yPinky, 0.25, 1.0) &&
            gesturePt === 'thirdJ'
          ) {
            lastTime = now;
            console.log('Fourth J point hit');
             gesturePt = null;
             letterRef.current = "J"
          }
        }
        if (indexFingerTip && letterRef.current === 'Z') {
          pinkyTip = null
          const xIndex = indexFingerTip['x'];
          const yIndex = indexFingerTip['y'];

          console.log("x:", xIndex, "\ny:", yIndex)

          if (
            coordRange(xIndex, 0.33, 1.0) &&
            coordRange(yIndex, 0.0, 0.68) &&
            gesturePt === null
          ) {
            gesturePt = 'firstZ';
            lastTime = now;
            console.log('First Z point hit');
          }
          if (
            coordRange(xIndex, 0.0, 0.33) &&
            coordRange(yIndex, 0.0, 0.68) &&
            gesturePt === 'firstZ'
          ) {
            gesturePt = 'secondZ';
            lastTime = now;
            console.log('Second Z point hit');
          }
          if (
            coordRange(xIndex, 0.46, 1.0) &&
            coordRange(yIndex, 0.46, 1.0) &&
            gesturePt === 'secondZ'
          ) {
            gesturePt = 'thirdZ';
           
            lastTime = now;
            console.log('Third Z point hit');
          }
          if (
            coordRange(xIndex, 0, 0.47) &&
            coordRange(yIndex, 0.61, 1.0) &&
            gesturePt === 'thirdZ'
          ) {
            lastTime = now;
            console.log('Fourth Z point hit');
            gesturePt = null;
            letterRef.current = "Z"
          }
        }
      };
   createMotionSign()

   return letterRef.current
    };
  


    // if (!motionEnabled) {
    //       cancelAnimationFrame(animationId);
    //       pinkyTip = null
    //       indexFingerTip = null
    //       return;
    //     }

// const useMotionSigns = (pixelValsRef, motionEnabled) => {
//   const gestureEstimate = useRef(null);
//   const letterRef = useRef(null);
//   const lastLetterRef = useRef(null);
//   const gesturePt = useRef(null);
//   const rafIdRef = useRef(null);

//   // const appendLetter = useMessageBody((state) => state.appendMessage);

//   useEffect(() => {
//     let lastUpdateTime = 0;

//     const validGestureShape = () => {
//       const pixelVals = pixelValsRef.current;
//       let gestureArr = [];

//       if (pixelVals) {
//         Object.entries(motionShapes).forEach(([unicodeVal, props]) => {
//           // let letter = String.fromCharCode(parseInt(unicodeVal.slice(1), 16))

//           const newGesture = new fp.GestureDescription(unicodeVal);

//           Object.entries(props.Curls).forEach(([fingerName, curlType]) => {
//             const curlConfidence = props.curlConf[fingerName];
//             newGesture.addCurl(
//               fp.Finger[fingerName],
//               fp.FingerCurl[curlType],
//               1.0
//             );
//           });
//           gestureArr.push(newGesture);
//         });

//         const GE = new fp.GestureEstimator(gestureArr);

//         const est = GE.estimate(pixelVals, 8.0);

//         // const test = () => {
//         //   console.log(est.poseData);

//         //   requestAnimationFrame(test);
//         // };
//         // requestAnimationFrame(test);

//         if (est.gestures.length > 0) {
//           let result = est.gestures.reduce((c1, c2) => {
//             return c1.score > c2.score ? c1 : c2;
//           });

//           const currUnicode = result.name;
//           const letter = String.fromCharCode(
//             parseInt(currUnicode.slice(1), 16)
//           );

//           letter = letter;
//         }
//       }
//     };

//     const motionGestures = () => {
//       const letter = letter;

     
//       const coordRange = (val, min, max) => {
//         return val >= min && val <= max;
//       };

//       let lastTime = Date.now();

//       const createMotionSign = () => {
//         validGestureShape();

//         let indexFingerTip = fingerTipsRef.current['indexTip'];
//         let pinkyTip = fingerTipsRef.current['pinkyTip'];
//         const now = Date.now();

//         const currentLetter = letter;

//         if (!motionEnabled) {
//           cancelAnimationFrame(rafIdRef.current);
//           rafIdRef.current = null;
//           pinkyTip = null
//           indexFingerTip = null
//           return;
//         }

//         if (lastletter !== currentLetter) {
//           gesturePt = null;
//           lastletter = currentLetter;
//         }

//         if (letter === 'J') {
//           indexFingerTip = null
//           const xPinky = pinkyTip['x'];
//           const yPinky = pinkyTip['y'];


//           if (
//             coordRange(xPinky, 0, 0.46) &&
//             coordRange(yPinky, 0.08, 1.0) &&
//             gesturePt === null
//           ) {
//             gesturePt = 'firstJ';
//             lastTime = now;
//             console.log('First J point hit');
//           }
//           if (
//             coordRange(xPinky, 0, 0.46) &&
//             coordRange(yPinky, 0.25, 1.0) &&
//             gesturePt === 'firstJ'
//           ) {
//             gesturePt = 'secondJ';
//             lastTime = now;
//             console.log('Second J point hit');
//           }
//           if (
//             coordRange(xPinky, 0, 0.61) &&
//             coordRange(yPinky, 0.35, 1.0) &&
//             gesturePt === 'secondJ'
//           ) {
//             gesturePt = 'thirdJ';
//             lastTime = now;
//             console.log('Third J point hit');
//           }
//           if (
//             coordRange(xPinky, 0.39, 1.0) &&
//             coordRange(yPinky, 0.25, 1.0) &&
//             gesturePt === 'thirdJ'
//           ) {
//             lastTime = now;
//             console.log('Fourth J point hit');
//             appendLetter(letter);
//             gesturePt = null;
//             letter = null;
//             // setMessageBody((msg) => msg + 'J');
//           }
//         }

//         if (indexFingerTip && letter === 'Z') {
//           pinkyTip = null
//           const xIndex = indexFingerTip['x'];
//           const yIndex = indexFingerTip['y'];

//           console.log("x:", xIndex, "\ny:", yIndex)

//           if (
//             coordRange(xIndex, 0.33, 1.0) &&
//             coordRange(yIndex, 0.0, 0.68) &&
//             gesturePt === null
//           ) {
//             gesturePt = 'firstZ';
//             lastTime = now;
//             console.log('First Z point hit');
//           }
//           if (
//             coordRange(xIndex, 0.0, 0.33) &&
//             coordRange(yIndex, 0.0, 0.68) &&
//             gesturePt === 'firstZ'
//           ) {
//             gesturePt = 'secondZ';
//             lastTime = now;
//             console.log('Second Z point hit');
//           }
//           if (
//             coordRange(xIndex, 0.46, 1.0) &&
//             coordRange(yIndex, 0.46, 1.0) &&
//             gesturePt === 'secondZ'
//           ) {
//             gesturePt = 'thirdZ';
           
//             lastTime = now;
//             console.log('Third Z point hit');
//           }
//           if (
//             coordRange(xIndex, 0, 0.47) &&
//             coordRange(yIndex, 0.61, 1.0) &&
//             gesturePt === 'thirdZ'
//           ) {
//             lastTime = now;
//             console.log('Fourth Z point hit');
//             appendLetter(letter);
//             gesturePt = null;
//             letter = null;
//             // setMessageBody((msg) => msg + 'Z');
//           }
//         }

//         rafIdRef.current = requestAnimationFrame(createMotionSign);
//       };
//       rafIdRef.current = requestAnimationFrame(createMotionSign);
//     };
//     motionGestures();
//   }, [motionEnabled]);
// };

// export default useMotionSigns;

// Object.entries(motionShapes).forEach(([unicodeVal, props]) => {
//   const newGesture = new fp.GestureDescription(unicodeVal);

//   Object.entries(props.Curls).forEach(([fingerName, curlType]) => {

//     newGesture.addCurl(
//       fp.Finger[fingerName],
//       fp.FingerCurl[curlType],
//       1.0
//     );
//   });

//   gestureArr.push(newGesture);
// });
