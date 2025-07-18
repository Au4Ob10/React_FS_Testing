import React, { useEffect, useRef, useState, useContext } from 'react';
import motionSigns from '../motionSignPts.json';
import { messageContext } from '../messageContext';

const useMotionSigns = (pinkyRef, indexFingerRef) => {
  const pinkyTipArr = useRef([]);
  const indexTipArr = useRef([]);
  const gestureStep = useRef(null);

  console.log(indexFingerRef.current);

  const { setMessageBody } = useContext(messageContext);

  const rafInterval = (callback, interval) => {
    let start = performance.now();
    const loop = (now) => {
      if (now - start >= interval) {
        callback();
        start = now;
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  };

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

      const zPoints = Object.keys(motionSigns.Z);

      //   const indexFingerX: any = indexTipArr.current.at(-1).x;
      //   const indexFingerY = indexTipArr.current.at(-1).y;

      const xMidpoint = 0.31;
      const yMidpoint = 0.75;

      const gesturePointNums = ['point1', 'point2', 'point3', 'point4'];

      const createZ = () => {
        if (indexFingerRef.current) {
          indexTipArr.current.push(indexFingerRef.current);

          // z vals
          //   const indexFingerX: any = indexTipArr.current.at(-1).x;
          //   const indexFingerY = indexTipArr.current.at(-1).y;

          const indexFingerX = indexFingerRef.current.x;
          const indexFingerY = indexFingerRef.current.y;

          //   console.log("x val:",indexFingerX, "\n", "y val:", indexFingerY )
          let i = 0;
          let isWaiting = false;

          if (i < zPoints.length) {
            const currentPoint = motionSigns.Z[zPoints[i]];

            const xFloor = currentPoint.xFloor;
            const xCeil = currentPoint.xCeil;
            const yFloor = currentPoint.yFloor;
            const yCeil = currentPoint.yCeil;

            if (
              coordRange(indexFingerX, xFloor, xCeil) &&
              coordRange(indexFingerY, yFloor, yCeil) &&
              !isWaiting
            ) {
              isWaiting = true;
              console.log();

              setTimeout(() => {
                console.log(zPoints[i]);
                i++;

                if (i === zPoints.length) {
                  setMessageBody((msg) => msg + 'Z');
                  i = 0;
                }
                isWaiting = false;
              }, 100);
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
