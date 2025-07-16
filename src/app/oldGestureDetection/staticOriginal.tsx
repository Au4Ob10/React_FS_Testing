// 'use client';
// import React, { useContext, useEffect, useRef, useState } from 'react';
// import * as fp from 'fingerpose';
// import { MSLGestArray, ASLGestArray } from 'components/generateSigns';
// import { msgBody } from '../messageContext';

export const useStaticSignsDetect = (
  landmarks,
  canvas,
  motionEnabled
) => {
  const [currentLanguage] = useState(MSLGestArray);
  const { setMessageBody } = useContext(msgBody);
 


  useEffect(() => {
   
      
    if (motionEnabled || !landmarks || !canvas) return;

    console.log(canvas,landmarks)
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
    const recognizeGestures = () => {
      if (!canvas) {
        return;
      }
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

  
      const pixelVals = landmarks.map(({ x, y, z }) => [
        x * canvasWidth,
        y * canvasHeight,
        z,
      ]);

      const GE = new fp.GestureEstimator(currentLanguage);
      const est = GE.estimate(pixelVals, 6.5);

      const pose = est.poseData;

      if (est.gestures.length > 0) {
        let currGesture = est.gestures.reduce((c1, c2) => {
          return c1.score > c2.score ? c1 : c2;
        });

        let letter = String.fromCharCode(
          parseInt(currGesture.name.slice(1), 16)
        );

        if (letter && pose) {
          setMessageBody((msg) => msg + letter);
        }
      }
    };

    rafInterval(() => {
      recognizeGestures;
    }, 400);

    recognizeGestures();
  }, []);
};
