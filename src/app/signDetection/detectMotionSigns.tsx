import React, { useEffect, useRef, useState, useContext } from 'react';



export const detectMotionSigns = (fingerTipsRef, motionLetter, gesturePt) => {


      let indexFingerTip = fingerTipsRef.current['indexTip'];
      let pinkyTip = fingerTipsRef.current['pinkyTip'];
      let gestureTimeoutId = null

    
      let currentTime;
      let finalLetter = ''
    
    setTimeout(function() {
      if (indexFingerTip) {
  console.log("index x: ", indexFingerTip.x, "\n Index y: ", indexFingerTip.y)
      }
}, 1000);
    

      const coordRange = (val, min, max) => {
        return val >= min && val <= max;
      };

        let now = performance.now()
        
        if (fingerTipsRef.current) {

        const fingerposeLetter = motionLetter.current

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
            gesturePt.current.J === null && fingerposeLetter === 'J'
          ) {
            gesturePt.current.J = 'firstJ';
            currentTime = now;
            console.log('First J point hit');
          }
          if (
            coordRange(xPinky, 0, 0.46) &&
            coordRange(yPinky, 0.25, 1.0) &&
            gesturePt.current.J === 'firstJ' && fingerposeLetter === 'J'
          ) {
            gesturePt.current.J = 'secondJ';
            currentTime = now;
            console.log('Second J point hit');
          }
          if (
            coordRange(xPinky, 0, 0.61) &&
            coordRange(yPinky, 0.35, 1.0) &&
            gesturePt.current.J === 'secondJ' && fingerposeLetter === 'J'
          ) {
            gesturePt.current.J = 'thirdJ';
            currentTime = now;
            console.log('Third J point hit');
          }
          if (
            coordRange(xPinky, 0.39, 1.0) &&
            coordRange(yPinky, 0.25, 1.0) &&
            gesturePt.current.J === 'thirdJ'&& fingerposeLetter === 'J'
          ) {
            currentTime = now;
            console.log('Fourth J point hit');
            finalLetter = "J"
            gesturePt.current.J = null;
          }
        }


        if (fingerposeLetter === "Z") {

  if (indexFingerTip.x > 0.6 && indexFingerTip.y < 5 && gesturePt.current.Z === null) {
    gesturePt.current.Z = 'gestureStart';
    console.log("Z Start");
  }


  if (indexFingerTip.x < 0.5 && indexFingerTip.y < 5 && gesturePt.current.Z === 'gestureStart') {
    gesturePt.current.Z = 'firstGesture';
    console.log("first z point");
  }

  if (indexFingerTip.x < 0.7 && indexFingerTip.y > 0.7 && gesturePt.current.Z === "firstGesture") {
    gesturePt.current.Z = 'secondGesture';
    console.log("second z point");
  }


  if (indexFingerTip.x < 0.5 && gesturePt.current.Z === 'secondGesture') {
    gesturePt.current.Z = 'thirdGesture';
    finalLetter = "Z";
    console.log("third z point");
    gesturePt.current.Z = null;
  }
}

      
 


      return finalLetter;
    };
      
  


  }