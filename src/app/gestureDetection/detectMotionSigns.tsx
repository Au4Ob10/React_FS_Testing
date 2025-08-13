import React, { useEffect, useRef, useState, useContext } from 'react';
import { messageContext } from '../messageContext';
import * as fp from 'fingerpose';
import motionShapes from '../motionShapes.json';



export const detectMotionSigns = (fingerTipsRef, motionLetter, gesturePt) => {


      let indexFingerTip = fingerTipsRef.current['indexTip'];
      let pinkyTip = fingerTipsRef.current['pinkyTip'];
      let gestureTimeoutId = null

    
      let currentTime;
      let finalLetter = ''
    

      // if (indexFingerTip) {
      //   console.log(indexFingerTip)
      // }

      const gestureTimeOut = () => {


        if (gestureTimeoutId) {
          clearTimeout(gestureTimeoutId)
        }

        gestureTimeoutId = setTimeout(() => {
          console.log("gesture expired")
        })
      }
   
     
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
  // Stage 1
  if (indexFingerTip.x > 0.6 && indexFingerTip.y < 5 && gesturePt.current.Z === null) {
    gesturePt.current.Z = 'gestureStart';
    console.log("Z Start");
  }

  // Stage 2
  if (indexFingerTip.x < 0.5 && indexFingerTip.y < 5 && gesturePt.current.Z === 'gestureStart') {
    gesturePt.current.Z = 'firstGesture';
    console.log("first z point");
  }

  // Stage 3
  if (indexFingerTip.x < 0.7 && indexFingerTip.y > 0.7 && gesturePt.current.Z === "firstGesture") {
    gesturePt.current.Z = 'secondGesture';
    console.log("second z point");
  }

  // Stage 4
  if (indexFingerTip.x < 0.5 && gesturePt.current.Z === 'secondGesture') {
    gesturePt.current.Z = 'thirdGesture';
    finalLetter = "Z";
    console.log("third z point");
    gesturePt.current.Z = null;
  }
}

      
    // if (fingerposeLetter === "Z") {

    //   const xIndexFinger = indexFingerTip.x  
    //   const yIndexFinger = indexFingerTip.y

    //    setTimeout(() => {
               
    //               if (xIndexFinger > 0.6 && yIndexFinger < 5 && gesturePt.current.Z=== null) {
    //                 gesturePt.current.Z= 'gestureStart'
    //                 console.log("Z Start")
    //               }
                    
    //                 if (xIndexFinger < 0.5 && yIndexFinger < 5 && gesturePt.current.Z=== 'gestureStart') {
    //                   gesturePt.current.Z= 'firstGesture';
    //                    console.log("first z point")
                      
    //                 }
                
    //             }, 300);
      
    //             setTimeout(() => {
    //               if (xIndexFinger < 0.7 && yIndexFinger > 0.7 && gesturePt.current.Z=== "firstGesture") {
    //                   gesturePt.current.Z= 'secondGesture';
    //                   console.log("second z point")
                     
    //               }
    //             }, 100);
      
    //             setTimeout(() => {
    //               if (xIndexFinger < 0.5 && gesturePt.current.Z=== 'secondGesture' ) {
    //                   gesturePt.current.Z = 'thirdGesture';
    //                   console.log("third z point")
    //                   finalLetter = "Z"
                      
    //               }
    //             }, 100);

    //             if (gesturePt.current.Z === "thirdGesture") {
    //               finalLetter = "Z"
    //               gesturePt.current.Z = null
    //             }
      
    // }
     
      // console.log(fingerposeLetter)

      // if (fingerposeLetter === "Z") {

        

      //    zDistancePts.xPt.push(indexFingerTip.x)
      //    zDistancePts.yPt.push(indexFingerTip.y)

      //    const x1 =  zDistancePts.xPt[0]
      //    const x2 =  zDistancePts.xPt.at(-1)
      //    const y1 =  zDistancePts.yPt[0]
      //    const y2 =  zDistancePts.yPt.at(-1)

      //   if (zDistancePts.xPt.length >= 2) {
      //   console.log(Math.sqrt((x2 - x1)**2 + (y2 - y1)**2))
      //   }

      // }


      return finalLetter;
    };
      
  






      // if (fingerposeLetter === "Z") {

}
      //   if (indexFingerTip && fingerposeLetter === 'Z') {
      //     pinkyTip = null
      //     const xIndex = indexFingerTip['x'];
      //     const yIndex = indexFingerTip['y'];

  



      //     if (
      //       coordRange(xIndex, 0.6, 1.0) &&
      //       coordRange(yIndex, 0.0, 0.29) &&
      //       gesturePt.current.Z === null 
      //     ) {
      //       gesturePt.current.Z = 'firstZ';
      //       currentTime = now;
      //       console.log('First Z point hit');
      //     }
      //     if (
      //       coordRange(xIndex, 0.1, 0.5) &&
      //       // coordRange(yIndex, 0.0, 0.29) &&
      //       gesturePt.current.Z === 'firstZ'
      //     ) {
      //       gesturePt.current.Z = 'secondZ';
      //       currentTime = now;
      //       console.log('Second Z point hit');
      //     }
      //     if (
      //       coordRange(xIndex, 0.6, 1.0) &&
      //       coordRange(yIndex, 0.61, 1.0) &&
      //       gesturePt.current.Z === 'secondZ'
      //     ) {
      //       gesturePt.current.Z = 'thirdZ';
           
      //       currentTime = now;
      //       console.log('Third Z point hit');
      //     }
      //     if (
      //       coordRange(xIndex, 0, 0.4) &&
      //       coordRange(yIndex, 0.68, 1.0) &&
      //       gesturePt.current.Z === 'thirdZ'
      //     ) {
      //       currentTime = now;
      //       console.log('Fourth Z point hit');
      //      finalLetter = "Z"
      //       gesturePt.current.Z = null;
      //       // motionLetter.current = null;
      //     }
         
      //   }
      // }

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