import React, { useContext, useEffect, useRef, useState, Dispatch, SetStateAction } from 'react';
import { msgBody } from '../messageContext';
import * as fp from 'fingerpose';
import { MSLGestArray, ASLGestArray } from 'components/generateSigns';


export const useMotionSignsDetect = (landmarks, motionEnabled) => {

  const indexTipArr = useRef([]);
  const pinkyTipArr = useRef([]);
  const pinkyFingerRef = useRef(null);
  const indexFingerRef = useRef(null);
  const landmarksRef = useRef(null)
  const gesturePtRef = useRef(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {messageBody, setMessageBody} = useContext(msgBody)

      landmarksRef.current = landmarks[20]
      
       const pinkyVals = landmarksRef.current
      pinkyTipArr.current = []

      if (!motionEnabled) {
        return;
      }
     

      if (pinkyVals) {
        pinkyTipArr.current.push({
          x: pinkyVals.x,
          y: pinkyVals.y,
          z: pinkyVals.z,
        });

        const x2 = pinkyTipArr.current.at(-1).x;
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
            setMessageBody((msg) => msg + 'J');
            console.log('J');
          }
        }, 300);
      }

      indexFingerRef.current = landmarks[8];
      const indexVals = indexFingerRef.current;


      if (indexVals) {
        indexTipArr.current.push(indexVals);

        if (indexTipArr.current.length >= 2) {

          const x2: any = indexTipArr.current.at(-1).x;
          const y2 = indexTipArr.current.at(-1).y;

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
             setMessageBody((msg) => msg + 'Z');
              console.log('Z');
              indexTipArr.current = [];
            }
          }, 100);
        }
      }

      return () => {
        gesturePtRef.current = null;
        pinkyTipArr.current = [];
        indexFingerRef.current = [];
      };
    
  }

