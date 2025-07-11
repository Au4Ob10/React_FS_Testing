import React, { useContext, useEffect, useRef, useState } from 'react';
import { messageContext } from '../page';

export const motionSigns = (landmarks, detectMotionSigns) => {
  const [messageBody, setMessageBody] = useContext(messageContext);
  const indexTipArr = useRef([]);
  const pinkyTipArr = useRef([]);
  const pinkyFingerRef = useRef(null);
  const indexFingerRef = useRef(null);
  const gesturePtRef = useRef<string | null>(null);

  if (!detectMotionSigns) {
    return;
  }

  useEffect(() => {
    const jRecognize = () => {
      pinkyFingerRef.current = landmarks[20];

      const pinkyVals = pinkyFingerRef.current;

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
            setMessageBody('J');
            console.log('J');
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
    const zRecognize = () => {
      indexFingerRef.current = landmarks[8];
      const indexVals = indexFingerRef.current;
      if (indexVals) {
        indexTipArr.current.push(indexVals);

        if (indexTipArr.current.length >= 2) {
          const x1: any = indexTipArr.current[0].x;
          const y1 = indexTipArr.current[0].y;
          const x2: any = indexTipArr.current.at(-1).x;
          const y2 = indexTipArr.current.at(-1).y;
          const deltaX = x2 - x1;
          const deltaY = y2 - y1;
          const slope = Math.abs(y2 - y1) / Math.abs(x2 - x1);

          // const zGesture = new fp.GestureDescription('z-sign')
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
              setMessageBody('Z');
              console.log('Z');
              indexTipArr.current = [];
            }
          }, 100);
        }
      }
      requestAnimationFrame(zRecognize);
    };

    requestAnimationFrame(zRecognize);
  }, []);
};
