import React, { useContext, useEffect, useRef, useState } from 'react';
import * as fp from 'fingerpose';
import { messageContext } from '../messageContext';
import { useMessageBody } from '../messageState';

const useStaticSigns = (letterRef, poseRef, motionEnabled: boolean) => {
  const lastAppendedLetterRef = useRef(null);
  const rafIdRef = useRef(null);

  const appendLetter = useMessageBody((state) => state.appendMessage);

  useEffect(() => {
    const rafInterval = (callback, interval) => {
      let start = performance.now();
      const loop = (now) => {
        if (!motionEnabled && now - start >= interval) {
          callback();
          start = now;
          
        } else if (motionEnabled) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
          return;
        }
        rafIdRef.current = requestAnimationFrame(loop); //
      };

      rafIdRef.current = requestAnimationFrame(loop); //
    };

    // if(motionEnabled) {
    //         return
    //     }

    const letterAppend = () => {
      const letter = letterRef.current;
      // if (letter && letter !== lastAppendedLetterRef.current) {
      // console.log(letter)
      if (letter) {
        appendLetter(letter);
        letterRef.current = null;
        // lastAppendedLetterRef.current = letter;
      }
    };
    if (!motionEnabled) {
      rafInterval(() => {
        letterAppend();
      }, 500);
    }
  }, [motionEnabled]);
};

export default useStaticSigns;
