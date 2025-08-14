import React, { useEffect, useRef, useState } from 'react';


useEffect(() => {

  const landmarkBuffer = useRef([])

 const motionGesturePt = useRef({
    J: null,
    Z: null
  });

    const zGestures = () => {
      const indexVals = indexFingerRef.current;
      if (indexVals) {
        landmarkBuffer.current.push(indexVals);

        if (landmarkBuffer.current.length >= 2) {
          const x1: any = landmarkBuffer.current[0].x;
          const y1 = landmarkBuffer.current[0].y;
          const x2: any = landmarkBuffer.current.at(-1).x;
          const y2 = landmarkBuffer.current.at(-1).y;
          const deltaX = x2 - x1;
          const deltaY = y2 - y1;
          const slope = Math.abs(y2 - y1) / Math.abs(x2 - x1);
          const gesture = zGestureRef.current

          // console.log("xVal", x2)
          // console.log("yVal", y2)
            //  console.log("xVal2:", x2 * 100)
            // console.log("deltaX", deltaX * 100)

          setTimeout(() => {
         
            if (x2 > 0.6 && y2 < 5 && zGestureRef.current === null) {
              zGestureRef.current = 'gestureStart'
              console.log(zGestureRef.current)
            }
              
              if (x2 < 0.5 && y2 < 5 && zGestureRef.current === 'gestureStart') {
                zGestureRef.current = 'firstGesture';
                 console.log(zGestureRef.current)
                landmarkBuffer.current = [];
              }
            

            // else {
            //   console.log("adjust x2 val by", Math.abs(x2-0.7))
            //   console.log("adjust deltaX val by", Math.abs(deltaX - 0.3))
            // }
          }, 300);

          setTimeout(() => {
            if (x2 < 0.7 && y2 > 0.7 && zGestureRef.current === "firstGesture") {
                zGestureRef.current = 'secondGesture';
                console.log(zGestureRef.current)
                 landmarkBuffer.current = [];
            }
          }, 100);

          setTimeout(() => {
            if (x2 < 0.5 && zGestureRef.current === 'secondGesture' ) {
                zGestureRef.current = 'thirdGesture';
                console.log(zGestureRef.current)
                console.log("Z")
                landmarkBuffer.current = [];
            }
          }, 100);

          // console.log('gest 1 x:', x1);
          // console.log('deltaX:', deltaX);

          // console.log(`Execution time: ${endTime - startTime} ms`);
        }
      }
      requestAnimationFrame(zGestures);
    };

    requestAnimationFrame(zGestures);
    // requestAnimationFrame(zGestures);


// export const useStore = create<useMessageStore>((set) => {
//   return {
//     messageBody: '',
//   };
// });

//     const useMyStore = create((set) => ({
//       // Initial state
//       count: 0,
//       message: 'Hello',

//       // Actions to update state
//       increment: () => set((state) => ({ count: state.count + 1 })),
//       setMessage: (newMessage) => set({ message: (newMessage) => {newMessage   }),
//     }));
