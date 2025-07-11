    'use client';
import React, { useEffect, useRef, useState, useContext, createContext } from 'react';


    const detectStaticGestures = () => {

        useEffect(() => {
            const rafInterval = (callback, interval) => {
      let start = performance.now();
      const loop = (now) => {
        if (now - start >= interval) {
          callback();
          start = now;
        }

        animationFrameId.current = requestAnimationFrame(loop);
      };

      requestAnimationFrame(loop);
    };




    }
    }, []);
    
