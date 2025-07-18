import React, { useEffect, useRef, useState, useContext } from 'react';
import { messageContext } from '../messageContext';
import * as fp from 'fingerpose';
import motionSigns from '../../../components/fs_language/motionGestures.json';
import { X } from 'node_modules/framer-motion/dist/types.d-CtuPurYT';

const useMotionSigns = (indexFingerRef, pinkyRef) => {
  // const indexFingerRef.current = landmarks.current[0][8]
  // const pinkyFingerVals = landmarks.current[0][20]

  const { setMessageBody } = useContext(messageContext);

  useEffect(() => {
    let lastUpdateTime = 0;

    const motionGestures = () => {
      //   const pinkyVals = pinkyFingerVals.current;

      const coordRange = (val, min, max) => {
        return val >= min && val <= max;
      };

      const createJ = () => {
        // if (pinkyRef.current) {
        // console.log("X:",pinkyRef.current['x'], "\n", "y:", pinkyRef.current['y'],  "\n", "z",pinkyRef.current['z']  )

        // }


         
    

 let finalPoint = false;


        if (pinkyRef.current) {
          const xPinky = pinkyRef.current['x'];
          const yPinky = pinkyRef.current['y'];

          const now = Date.now();
         
        //   console.log("x:", xPinky, "\n","y:", yPinky )
        

          if (
            coordRange(xPinky, 0, 0.46) &&
            coordRange(yPinky, 0.08, 1.0) &&
            currPt === null
          ) {
            currPt = 'first';
            lastTime = now;
            console.log('First point hit');
          } else if (
            coordRange(xPinky, 0, 0.46) &&
            coordRange(yPinky, 0.25, 1.0) &&
            currPt === 'first'
          ) {
            currPt = 'second';
            lastTime = now;
            console.log('Second point hit');
          } else if (
            coordRange(xPinky, 0, 0.61) &&
            coordRange(yPinky, 0.35, 1.0) &&
            currPt === 'second'
          ) {
            currPt = 'third';
            lastTime = now;
            console.log('Third point hit');
          } 
           else if (
            coordRange(xPinky, 0.39, 1.0) &&
            coordRange(yPinky, 0.25, 1.0) &&
            currPt === 'third'
          ) {
            currPt = null;
            finalPoint = true;
            lastTime = now;
            console.log('Fourth point hit');
            setMessageBody((msg) => msg + 'Z');
          }
        }

         const jSequence  = requestAnimationFrame(createJ);
        if (finalPoint) {
            cancelAnimationFrame(jSequence)
            finalPoint = false;
            createJ()
        }
       
      };



      requestAnimationFrame(createJ);

      //       const zSign = new fp.GestureDescription('U005A');

      //       Object.entries(motionSigns.U005A.Curls).forEach(([finger,curlType]) => {
      //         zSign.addCurl(fp.Finger[finger],fp.FingerCurl[curlType], 1)
      //       })

      //   console.log(zSign

      let currPt = null;
      let lastTime = Date.now();

      //       if (now - lastTime > 3000) {
      //   currPt = null;
      // }

      const zShape = {
        Curls: {
          Thumb: 'FullCurl',
          Index: 'NoCurl',
          Middle: 'FullCurl',
          Ring: 'FullCurl',
          Pinky: 'FullCurl',
        },
      };

      const createZ = () => {
        if (indexFingerRef.current) {
          const xIndex = indexFingerRef.current.x;
          const yIndex = indexFingerRef.current.y;

          const now = Date.now();

          if (
            coordRange(xIndex, 0.33, 1.0) &&
            coordRange(yIndex, 0.0, 0.68) &&
            currPt === null
          ) {
            currPt = 'first';
            lastTime = now;
            console.log('First point hit');
          } else if (
            coordRange(xIndex, 0.0, 0.33) &&
            coordRange(yIndex, 0.0, 0.68) &&
            currPt === 'first'
          ) {
            currPt = 'second';
            lastTime = now;
            console.log('Second point hit');
          } else if (
            coordRange(xIndex, 0.33, 1.0) &&
            coordRange(yIndex, 0.68, 1.0) &&
            currPt === 'second'
          ) {
            currPt = 'third';
            lastTime = now;
            console.log('Third point hit');
          } else if (
            coordRange(xIndex, 0, 0.33) &&
            coordRange(yIndex, 0.68, 1.0) &&
            currPt === 'third'
          ) {
            currPt = null;
            lastTime = now;
            console.log('Fourth point hit');
            setMessageBody((msg) => msg + 'Z');
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

//   const firstRange = motionSigns.Z.point1;
//           const secondRange = motionSigns.Z.point2;
//           const thirdRange = motionSigns.Z.point3;
//           const fourthRange = motionSigns.Z.point4;
