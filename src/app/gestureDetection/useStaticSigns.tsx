import React, { useContext, useEffect, useRef, useState } from 'react';
import * as fp from 'fingerpose';
import { messageContext } from '../messageContext';

const useStaticSigns = (letterRef, poseRef, motionEnabled: boolean) => {
  const lastAppendedLetterRef = useRef(null);
  const { setMessageBody } = useContext(messageContext);



  useEffect(() => {
   
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
    

    if(motionEnabled) {
            return
        }
        
    rafInterval(() => {

        
       

      if (letterRef && poseRef.current) {
        const letter = letterRef.current
        if (letter && letter !== lastAppendedLetterRef.current) {
            console.log(letter)
          setMessageBody((msg) => msg + letter);
          lastAppendedLetterRef.current = letter;
        }
        letterRef.current = null
      }
    }, 400);
  }, []);
};

export default useStaticSigns;
