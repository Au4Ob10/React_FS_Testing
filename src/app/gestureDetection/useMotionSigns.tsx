import React, { useEffect, useRef, useState, useContext } from 'react';
import { messageContext } from '../messageContext';
import * as fp from 'fingerpose';
import motionSigns from '../../../components/fs_language/motionGestures.json';
import { landmarksRef } from '../landmarkRefs';
import motionShapes from '../motionShapes.json';

const useMotionSigns = (landmarks, pixelValsRef, motionEnabled) => {
  const gestureEstimate = useRef(null);
  const letterRef = useRef(null);
  const [currLetter, setCurrLetter] = useState(null);
  const rafIdRef = useRef(null);
  //  const test = () => {

  //   if (pixelValsRef)
  //   {
  //     console.log(pixelValsRef)
  //   }

  //   requestAnimationFrame(test)

  // }
  // requestAnimationFrame(test)

  // const { setMessageBody } = useContext(messageContext);

  useEffect(() => {
    let lastUpdateTime = 0;

    const validGestureShape = () => {
      const pixelVals = pixelValsRef.current;
      let gestureArr = [];

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

        const GE = new fp.GestureEstimator(gestureArr);

        const est = GE.estimate(pixelVals, 7.5);

        if (est.gestures.length > 0) {
          let result = est.gestures.reduce((c1, c2) => {
            return c1.score > c2.score ? c1 : c2;
          });

          const currUnicode = result.name;
          const letter = String.fromCharCode(
            parseInt(currUnicode.slice(1), 16)
          );

          setTimeout(() => {
          letterRef.current = letter;
          }, 200);
        }
      }
    };

    // const test = () => {
    //       validGestureShape();
    //         console.log(letterRef.current)

    //     }
    //       requestAnimationFrame(test)

    //   requestAnimationFrame(test)

    const motionGestures = () => {
      const letter = letterRef.current;

      const coordRange = (val, min, max) => {
        return val >= min && val <= max;
      };

      //   const createJ = () => {
      //     validGestureShape();
      //     const pinkyTip = landmarksRef.current['pinkyTip'];

      //     if (letterRef.current === "Z") {
      //       if (rafIdRef.current) {
      //         cancelAnimationFrame(rafIdRef.current)
      //         rafIdRef.current = null
      //       }
      //       return
      //     }

      //     if (pinkyTip && letterRef.current === 'J') {
      //       const xPinky = pinkyTip['x'];
      //       const yPinky = pinkyTip['y'];

      //       const now = Date.now();

      //       //   console.log("x:", xPinky, "\n","y:", yPinky )

      //       if (
      //         coordRange(xPinky, 0, 0.46) &&
      //         coordRange(yPinky, 0.08, 1.0) &&
      //         currPt === null
      //       ) {
      //         currPt = 'first';
      //         lastTime = now;
      //         console.log('First point hit');
      //       }
      //       if (
      //         coordRange(xPinky, 0, 0.46) &&
      //         coordRange(yPinky, 0.25, 1.0) &&
      //         currPt === 'first'
      //       ) {
      //         currPt = 'second';
      //         lastTime = now;
      //         console.log('Second point hit');
      //       }
      //       if (
      //         coordRange(xPinky, 0, 0.61) &&
      //         coordRange(yPinky, 0.35, 1.0) &&
      //         currPt === 'second'
      //       ) {
      //         currPt = 'third';
      //         lastTime = now;
      //         console.log('Third point hit');
      //       }
      //       if (
      //         coordRange(xPinky, 0.39, 1.0) &&
      //         coordRange(yPinky, 0.25, 1.0) &&
      //         currPt === 'third'
      //       ) {
      //         currPt = null;
      //         lastTime = now;
      //         console.log('Fourth point hit');
      //         // setMessageBody((msg) => msg + 'J');
      //       }

      //     }

      //     rafIdRef.current =  requestAnimationFrame(createJ)
      //     // const jSequence = requestAnimationFrame(createJ);
      //     // if (finalPoint) {
      //     //   cancelAnimationFrame(jSequence);
      //     //   finalPoint = false;
      //     //   createJ();
      //     // }
      //   };

      //  rafIdRef.current =  requestAnimationFrame(createJ);

      let currPt = null;
      let lastTime = Date.now();

      //       if (now - lastTime > 3000) {
      //   currPt = null;
      // }

      const createZ = () => {
        validGestureShape();
        const indexFingerTip = landmarksRef.current['indexTip'];
      
          if (letterRef.current === "J") {
          if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current)
            rafIdRef.current = null
          }
          // return
        }

        if (indexFingerTip && letterRef.current === 'Z') {
          const now = Date.now();
           const xIndex = indexFingerTip['x']
        const yIndex = indexFingerTip['y']

          if (
            coordRange(xIndex, 0.33, 1.0) &&
            coordRange(yIndex, 0.0, 0.68) &&
            currPt === null
          ) {
            currPt = 'first';
            lastTime = now;
            console.log('First point hit');
          }
          if (
            coordRange(xIndex, 0.0, 0.33) &&
            coordRange(yIndex, 0.0, 0.68) &&
            currPt === 'first'
          ) {
            currPt = 'second';
            lastTime = now;
            console.log('Second point hit');
          }
          if (
            coordRange(xIndex, 0.33, 1.0) &&
            coordRange(yIndex, 0.68, 1.0) &&
            currPt === 'second'
          ) {
            currPt = 'third';
            lastTime = now;
            console.log('Third point hit');
          }
          if (
            coordRange(xIndex, 0, 0.33) &&
            coordRange(yIndex, 0.68, 1.0) &&
            currPt === 'third'
          ) {
            currPt = null;
            lastTime = now;
            console.log('Fourth point hit');
            // setMessageBody((msg) => msg + 'Z');
          }
        }
        // if (!motionEnabled) {
        //   return;
        // }

         rafIdRef.current =  requestAnimationFrame(createZ)
        // requestAnimationFrame(createZ);
      };
      // requestAnimationFrame(createZ);
       rafIdRef.current =  requestAnimationFrame(createZ)
    };
    motionGestures();
  }, []);
};

export default useMotionSigns;

//   const firstRange = motionSigns.Z.point1;
//           const secondRange = motionSigns.Z.point2;
//           const thirdRange = motionSigns.Z.point3;
//           const fourthRange = motionSigns.Z.point4;
