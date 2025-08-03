import React, { useEffect, useRef, useState, useContext } from 'react';
import { messageContext } from '../messageContext';
import * as fp from 'fingerpose';
import motionShapes from '../motionShapes.json';



export const detectMotionGesture = (pixelValsRef,fingerTipsRef,motionLetter) => {

      const pixelVals = pixelValsRef.current;
      
      let gestureArr = [];
      let letter: string;

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
    
  
      const createMotionSign = () => {    

      let indexFingerTip = fingerTipsRef.current['indexTip'];
      let pinkyTip = fingerTipsRef.current['pinkyTip'];

      let animationId;
      let gesturePt;
      let lastTime;
   
     
      const coordRange = (val, min, max) => {
        return val >= min && val <= max;
      };

    
  
        const now = Date.now();

        // if (!motionEnabled) {
        //   cancelAnimationFrame(animationId);
        //  animationId = null
        //   pinkyTip = null
        //   indexFingerTip = null
        //   return;
        // }
        
        if (fingerTipsRef.current) {
    
        if (motionLetter.current.fingerpose === 'J') {
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
            motionLetter.current.final = "J"
            gesturePt = null;
          }
        }

        if (indexFingerTip && motionLetter.current.fingerpose === 'Z') {
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
            motionLetter.current.final = "Z"
            gesturePt = null;
            // motionLetter.current = null;
          }
        }
      }
      
      };
      createMotionSign()
    };
  
  



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
