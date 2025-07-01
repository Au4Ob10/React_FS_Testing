import React, { useEffect, useRef, useState } from 'react';


const detectZ = () => {
useEffect(() => {
    const zGestures = () => {
      const indexVals = indexFingerRef.current;
      if (indexVals) {
        indexLandmarks.current.push(indexVals);

        if (indexLandmarks.current.length >= 2) {
          const x1: any = indexLandmarks.current[0].x;
          const y1 = indexLandmarks.current[0].y;
          const x2: any = indexLandmarks.current.at(-1).x;
          const y2 = indexLandmarks.current.at(-1).y;
          const deltaX = x2 - x1;
          const deltaY = y2 - y1;
          const slope = Math.abs(y2 - y1) / Math.abs(x2 - x1);
          const gesture = gestureRef.current;

          const zGesture = new fp.GestureDescription('z-sign')
    
          // const est = GE.estimate(landmarksRef.current, 6.5);

          setTimeout(() => {
            if (x2 > 0.6 && y2 < 5 && gestureRef.current === null) {
              gestureRef.current = 'gestureStart';
              console.log(gestureRef.current);
            }

            if (x2 < 0.5 && y2 < 5 && gestureRef.current === 'gestureStart') {
              gestureRef.current = 'firstGesture';
              console.log(gestureRef.current);
              indexLandmarks.current = [];
            }
          }, 300);

          setTimeout(() => {
            if (x2 < 0.7 && y2 > 0.7 && gestureRef.current === 'firstGesture') {
              gestureRef.current = 'secondGesture';
              console.log(gestureRef.current);
              indexLandmarks.current = [];
            }
          }, 100);

          setTimeout(() => {
            if (x2 < 0.5 && gestureRef.current === 'secondGesture') {
              gestureRef.current = 'thirdGesture';
              console.log(gestureRef.current);
              console.log('Z');
              indexLandmarks.current = [];
            }
          }, 100);

        }
      }
      requestAnimationFrame(zGestures);
    };

    requestAnimationFrame(zGestures);
  }, []);

}