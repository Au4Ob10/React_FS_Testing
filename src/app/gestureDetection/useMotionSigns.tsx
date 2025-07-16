import React, { useEffect, useRef, useState, useContext } from 'react';
import motionSigns from '../motionSignPts.json';
import { messageContext } from '../messageContext';

const useMotionSigns = (pinkyRef, indexFingerRef) => {
  const pinkyTipArr = useRef([]);
  const indexTipArr = useRef([]);

  const { setMessageBody } = useContext(messageContext);

  const noop = () => {};

  const requestTimeout = (fn, delay, registerCancel) => {
    const start = Date.now();

    const loop = () => {
      const delta = Date.now() - start;

      if (delta >= delay) {
        fn();
        registerCancel(noop);
        return;
      }

      const raf = requestAnimationFrame(loop);
      registerCancel(() => cancelAnimationFrame(raf));
    };

    const raf = requestAnimationFrame(loop);
    registerCancel(() => cancelAnimationFrame(raf));
  };

  useEffect(() => {
    let lastUpdateTime = 0;

    const motionGestures = () => {
      //   const pinkyVals = pinkyRef.current;

      //   if (pinkyVals) {
      //     pinkyTipArr.current.push({
      //       x: pinkyVals.x,
      //       y: pinkyVals.y,
      //       z: pinkyVals.z,
      //     });

      //   const pinkyFingerX = pinkyTipArr.current.at(-1).x;
      //   const pinkyFingerY = pinkyTipArr.current.at(-1).y;

      //   console.log('x:', indexFingerX, '\n', 'y:', indexFingerY);

      //   setTimeout(() => {
      //     if (indexFingerX < -0.01 && indexFingerY < -0.06) {
      //       gesturePtRef.current = 'first point';
      //       console.log(gesturePtRef.current);
      //     }
      //   }, 300);

      //   setTimeout(() => {
      //     if (
      //       pinkyFingerX > 0.02 &&
      //       pinkyFingerY > 0.01 &&
      //       gesturePtRef.current === 'first point'
      //     ) {
      //       gesturePtRef.current = 'second point';
      //       console.log(gesturePtRef.current);
      //     }
      //   }, 300);

      //   setTimeout(() => {
      //     if (
      //       pinkyFingerX > 0.05 &&
      //       pinkyFingerY > -0.016 &&
      //       gesturePtRef.current === 'second point'
      //     ) {
      //       gesturePtRef.current = 'third point';
      //       console.log(gesturePtRef.current);

      //       console.log('J');
      //       setMessageBody((msg) => msg + 'J');
      //       letterRef.current = null;
      //       gesturePtRef.current = null;
      //     }
      //   }, 300);
      // }

      const coordRange = (val, min, max) => {
        return val >= min && val <= max;
      };

      let i = 0;

      const rangeVals = Object.values(motionSigns.Z)[i];
      const zPoints = Object.keys(motionSigns.Z);

      const xFloor = rangeVals.xFloor;
      const xCeil = rangeVals.xCeil;
      const yFloor = rangeVals.yFloor;
      const yCeil = rangeVals.yCeil;

      let isWaiting = false;

      const createZ = () => {
        if (indexFingerRef.current) {
          indexTipArr.current.push(indexFingerRef.current);

          // z vals
          const indexFingerX: any = indexTipArr.current.at(-1).x;
          const indexFingerY = indexTipArr.current.at(-1).y;

          if (i < zPoints.length - 1) {
            if (
              coordRange(indexFingerX, xFloor, xCeil) &&
              coordRange(indexFingerY, yFloor, yCeil) &&
              !isWaiting
            ) {
              isWaiting = true;

              setTimeout(() => {
                console.log(zPoints[i]);
                i++;

                if (i === 4) {
                  setMessageBody((msg) => msg + 'Z');
                }
                isWaiting = false;
              }, 300);
            }
          }
        }
        requestAnimationFrame(createZ);
      };
      requestAnimationFrame(createZ);
    };
    motionGestures();
  }, []);
};

export default useMotionSigns;
