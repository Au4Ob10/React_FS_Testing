
import React, { useEffect, useRef, useState} from 'react';
import * as fp from 'fingerpose';

const motionSigns = (results: any) => {

  const pinkyRef = useRef(results.worldLandmarks[0][20]);
  const indexFingerRef = useRef(results.landmarks[0][8]);
  const gesturePtRef = useRef(null);
  const pinkyTipArr = useRef([]);
  const indexTipArr = useRef([]);
  
  let letterOutput: string;

  useEffect(() => {
    const jRecognize = () => {
      const pinkyVals = pinkyRef.current;

      if (pinkyVals) {
        pinkyTipArr.current.push({
          x: pinkyVals.x,
          y: pinkyVals.y,
          z: pinkyVals.z,
        });

        const x1 = pinkyTipArr.current[0].x;
        const x2 = pinkyTipArr.current.at(-1).x;

        const y1 = pinkyTipArr.current[0].y;
        const y2 = pinkyTipArr.current.at(-1).y;

        setTimeout(() => {
          if (x2 < -0.01 && y2 < -0.06) {
            gesturePtRef.current = 'first point';
            console.log(gesturePtRef.current);
          }
        }, 300);

        setTimeout(() => {
          if (
            x2 > -0.001 &&
            y2 < -0.01 &&
            gesturePtRef.current === 'first point'
          ) {
            gesturePtRef.current = 'second point';
            console.log(gesturePtRef.current);
          }
        }, 300);

        setTimeout(() => {
          if (
            x2 > 0.07 &&
            y2 < -0.02 &&
            gesturePtRef.current === 'second point'
          ) {
            gesturePtRef.current = 'third point';
            console.log(gesturePtRef.current);
            letterOutput = "J"
          }
        }, 300);
      }
      requestAnimationFrame(jRecognize);
    };
    requestAnimationFrame(jRecognize);

    return () => {
      gesturePtRef.current = null;
      pinkyTipArr.current = [];
    };
  }, []);

  useEffect(() => {
    const zGestures = () => {
      const indexVals = indexFingerRef.current;
      if (indexVals) {
        indexTipArr.current.push(indexVals);

        if (indexTipArr.current.length >= 2) {
          const x1: any = indexTipArr.current[0].x;
          const y1 = indexTipArr.current[0].y;
          const x2: any = indexTipArr.current.at(-1).x;
          const y2 = indexTipArr.current.at(-1).y;
     
          const zGesture = new fp.GestureDescription('z-sign');

          // const est = GE.estimate(landmarksRef.current, 6.5);

          setTimeout(() => {
            if (x2 > 0.6 && y2 < 5 && gesturePtRef.current === null) {
              gesturePtRef.current = 'gestureStart';
              console.log(gesturePtRef.current);
            }

            if (x2 < 0.5 && y2 < 5 && gesturePtRef.current === 'gestureStart') {
              gesturePtRef.current = 'firstGesture';
              console.log(gesturePtRef.current);
              indexTipArr.current = [];
            }
          }, 300);

          setTimeout(() => {
            if (
              x2 < 0.7 &&
              y2 > 0.7 &&
              gesturePtRef.current === 'firstGesture'
            ) {
              gesturePtRef.current = 'secondGesture';
              console.log(gesturePtRef.current);
              indexTipArr.current = [];
            }
          }, 100);

          setTimeout(() => {
            if (x2 < 0.5 && gesturePtRef.current === 'secondGesture') {
              gesturePtRef.current = 'thirdGesture';
              console.log(gesturePtRef.current);
              letterOutput = 'Z'
              indexTipArr.current = [];
            }
          }, 100);
        }
      }
      requestAnimationFrame(zGestures);
    };

    requestAnimationFrame(zGestures);

    return () => {
      gesturePtRef.current = null;
    };
  }, []);

  return letterOutput;
};

export default motionSigns;

// Mouse Click events

// Z sign
// const zRecognize = () => {
//   const indexVals = indexFingerRef.current;

//   if (indexVals) {
//     indexArrRef.current.push({ x: indexVals.x, y: indexVals.y });

//     if (indexArrRef.current.length >= 1) {
//       const x1 = indexArrRef.current[0].x;
//       const y1 = indexArrRef.current[0].y;
//       // const z1 = indexArrRef.current[0].z;
//       const x2 = indexArrRef.current.at(-1).x;
//       const y2 = indexArrRef.current.at(-1).y;

//       const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1)) * 100;
//       const deltaX = x2 - x1;
//       const deltaY = y2 - y1;
//       const slope = (y2 - y1) / (x2 - x1);

//       console.log('Current X:', x2);
//       // console.log('Current Y:', y2);
//       console.log(deltaX);
//       // console.log(deltaY);
//     }
//     // console.log("Current Y", y2)
//     // console.log('slope:', slope);
//     indexFingerRef.current = [];
//   }
// };
