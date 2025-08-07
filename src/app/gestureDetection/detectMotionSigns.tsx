import React, { useEffect, useRef, useState, useContext } from 'react';
import { messageContext } from '../messageContext';
import * as fp from 'fingerpose';
import motionShapes from '../motionShapes.json';



export const detectMotionSigns = (fingerTipsRef, motionLetter, gesturePt) => {

      let indexFingerTip = fingerTipsRef.current['indexTip'];
      let pinkyTip = fingerTipsRef.current['pinkyTip'];

    
      let currentTime;
      let finalLetter = ''
    
   
     
      const coordRange = (val, min, max) => {
        return val >= min && val <= max;
      };

        let now = performance.now()
        
        if (fingerTipsRef.current) {

        const fingerposeLetter = motionLetter.current

    
        // z   x greater to left, y greater moving down

        // pt. 1  x > 0.5 y < 0.49

        // pt. 2 x < 0.5 y > 0.49

        // pt. 3 x > 0.5 y > 0.49

        // pt. 4 x < 0.5 y > 0.49
    
        if (fingerposeLetter === 'J') {
          indexFingerTip = null
          const xPinky = pinkyTip.x;
          const yPinky = pinkyTip.y;

          currentTime = now;

          // if (currentTime - now >= 2000) {
          //   pinkyTip = null
          //   now = performance.now()
          // }

          if (
            coordRange(xPinky, 0, 0.46) &&
            coordRange(yPinky, 0.08, 1.0) &&
            gesturePt.current.J === null 
          ) {
            gesturePt.current.J = 'firstJ';
            currentTime = now;
            console.log('First J point hit');
          }
          if (
            coordRange(xPinky, 0, 0.46) &&
            coordRange(yPinky, 0.25, 1.0) &&
            gesturePt.current.J === 'firstJ'
          ) {
            gesturePt.current.J = 'secondJ';
            currentTime = now;
            console.log('Second J point hit');
          }
          if (
            coordRange(xPinky, 0, 0.61) &&
            coordRange(yPinky, 0.35, 1.0) &&
            gesturePt.current.J === 'secondJ'
          ) {
            gesturePt.current.J = 'thirdJ';
            currentTime = now;
            console.log('Third J point hit');
          }
          if (
            coordRange(xPinky, 0.39, 1.0) &&
            coordRange(yPinky, 0.25, 1.0) &&
            gesturePt.current.J === 'thirdJ'
          ) {
            currentTime = now;
            console.log('Fourth J point hit');
            finalLetter = "J"
            gesturePt.current.J = null;
          }
        }

        if (indexFingerTip && fingerposeLetter === 'Z') {
          pinkyTip = null
          const xIndex = indexFingerTip['x'];
          const yIndex = indexFingerTip['y'];

          console.log(indexFingerTip)
     // z   x greater to left, y greater moving down

        // pt. 1  x > 0.5 y < 0.49

        // pt. 2 x < 0.5 y > 0.49

        // pt. 3 x > 0.5 y > 0.49

        // pt. 4 x < 0.5 y > 0.49
          if (
            coordRange(xIndex, 0.6, 1.0) &&
            coordRange(yIndex, 0.0, 0.29) &&
            gesturePt.current.Z === null 
          ) {
            gesturePt.current.Z = 'firstZ';
            currentTime = now;
            console.log('First Z point hit');
          }
          if (
            coordRange(xIndex, 0.0, 0.35) &&
            coordRange(yIndex, 0.49, 1.0) &&
            gesturePt.current.Z === 'firstZ'
          ) {
            gesturePt.current.Z = 'secondZ';
            currentTime = now;
            console.log('Second Z point hit');
          }
          if (
            coordRange(xIndex, 0.64, 1.0) &&
            coordRange(yIndex, 0.61, 1.0) &&
            gesturePt.current.Z === 'secondZ'
          ) {
            gesturePt.current.Z = 'thirdZ';
           
            currentTime = now;
            console.log('Third Z point hit');
          }
          if (
            coordRange(xIndex, 0, 0.4) &&
            coordRange(yIndex, 0.68, 1.0) &&
            gesturePt.current.Z === 'thirdZ'
          ) {
            currentTime = now;
            console.log('Fourth Z point hit');
           finalLetter = "Z"
            gesturePt.current.Z = null;
            // motionLetter.current = null;
          }
         
        }
      }
      return finalLetter;
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