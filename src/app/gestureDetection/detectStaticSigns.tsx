import React, { useContext, useEffect, useRef, useState } from 'react';
import * as fp from 'fingerpose';


const detectStaticSigns = (currentLanguage, pixelValsRef) => {
  let letter = ''
   let recentGestures = [];

const smoothPrediction = (predictedGesture) => {
  recentGestures.push(predictedGesture);
  if (recentGestures.length > 8) recentGestures.shift(); 
  const modeGesture = recentGestures
    .sort((a,b) =>
      recentGestures.filter(v => v === a).length - recentGestures.filter(v => v === b).length
    ).pop();

  return modeGesture;
}




  if (pixelValsRef.current && pixelValsRef.current.length) {


    // Source: A. Potato, “fingerpose — Hand-pose estimation using fingerpose,” GitHub repo.
// https://github.com/andypotato/fingerpose/blob/master/dist/index.html
// Accessed: 17 Nov. 2025.

    const GE = new fp.GestureEstimator(currentLanguage);
    const est = GE.estimate(pixelValsRef.current, 5.5);

   const stableGesture = smoothPrediction(est.poseData)
  
    if (est.gestures.length > 0) {
      let result = est.gestures.reduce((c1, c2) => {
        return c1.score > c2.score ? c1 : c2;
      });

      const currUnicode = result.name;

    //  console.log(est.poseData)

      letter = String.fromCharCode(parseInt(currUnicode.slice(1), 16));
    }
  
  }
  return letter;

}

export default detectStaticSigns









    // const lastAppendedLetterRef = useRef(null);
// const rafIdRef = useRef(null);

// const setMessageBody = useMessageBody((state) => state.appendMessage);

// useEffect(() => {
//   const rafInterval = (callback, interval) => {
//     let start = performance.now();
//     const loop = (now) => {
//       if (!motionEnabled && now - start >= interval) {
//         callback();
//         start = now;
//       }
//       else if (deleteLetterRef.current === "delete")  {
//        console.log('test')
//       }
//       else if (clearMessageRef.current === "clear") {
//         setMessageBody('')
//         clearMessageRef.current = null
//       }
//       else if (motionEnabled) {
//         cancelAnimationFrame(rafIdRef.current);
//         rafIdRef.current = null;
//         letterRef.current = null;
//         return;
//       }
//       rafIdRef.current = requestAnimationFrame(loop);
//     };

//     rafIdRef.current = requestAnimationFrame(loop);
//   };

//   // if(motionEnabled) {
//   //         return
//   //     }

//   const letterAppend = () => {
//     // if (letter && letter !== lastAppendedLetterRef.current) {
//     // console.log(letter)
//     if (letterRef.current) {
//       setMessageBody(letterRef.current);
//       letterRef.current = null;
//       // lastAppendedLetterRef.current = letter;
//     }
//   };

//   rafInterval(() => {
//     letterAppend();
//   }, 500);
// }, [motionEnabled]);
// };

// export default useStaticSigns;