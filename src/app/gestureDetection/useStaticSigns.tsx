import React, { useContext, useEffect, useRef, useState } from 'react';
import * as fp from 'fingerpose';
import { messageContext } from '../messageContext';
import { useMessageBody } from '../messageState';
import { clearMessageRef, deleteLetterRef } from '../deletionRef';

const useStaticSigns = (letterRef, motionEnabled: boolean) => {
  const lastAppendedLetter = useRef(null);
  const rafIdRef = useRef(null);

  const setMessageBody = useMessageBody((state) => state.appendMessage);

  useEffect(() => {
    const rafInterval = (callback, interval) => {
      let start = performance.now();
      const loop = (now) => {
        if (!motionEnabled && now - start >= interval) {
          if (letterRef.current) {
          callback();
          }
          else {
            cancelAnimationFrame(rafIdRef.current)
          }
          start = now;
        }

        else if (deleteLetterRef.current === "delete") {
          console.log('test')
        }
        else if (clearMessageRef.current === "clear") {
          setMessageBody('')
          clearMessageRef.current = null
        }
        else if (motionEnabled) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
          letterRef.current = null;
          return;
        }
        rafIdRef.current = requestAnimationFrame(loop);
      };

      rafIdRef.current = requestAnimationFrame(loop);
    };

    // if(motionEnabled) {
    //         return
    //     }

    let start = performance.now();

    const letterAppend = () => {
   
  
    if (letterRef.current) {
        const currTime = performance.now();
      // if (currTime - start <= 100) {
        setMessageBody(letterRef.current);
        letterRef.current = null;
        resetTimer()
      // }
    }

    requestAnimationFrame(letterAppend)
    };
      requestAnimationFrame(letterAppend)


      const resetTimer = () => {
        start = performance.now()
      }
    // setTimeout(timerReset,100)
    // rafInterval(() => {

    //   letterAppend();
      
    // }, 500);
  }, [motionEnabled]);
};

export default useStaticSigns;
