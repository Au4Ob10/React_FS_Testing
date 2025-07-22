import React, { useEffect, useRef, useState, useContext } from 'react';
import { messageContext } from '../messageContext';
import * as fp from 'fingerpose';
import motionSigns from '../../../components/fs_language/motionGestures.json';
import { fingerTipsRef } from '../landmarkRefs';
import motionShapes from '../motionShapes.json';
import { useMessageBody } from '../messageState';

const useMotionSigns = (pixelValsRef, motionEnabled) => {
  const gestureEstimate = useRef(null);
  const letterRef = useRef(null);
  const lastLetterRef = useRef(null);
  const gesturePt = useRef(null);
  const rafIdRef = useRef(null);

  const appendLetter = useMessageBody((state) => state.appendMessage);

  useEffect(() => {
    let lastUpdateTime = 0;

    const validGestureShape = () => {
      const pixelVals = pixelValsRef.current;
      let gestureArr = [];

      if (pixelVals) {
        Object.entries(motionShapes).forEach(([unicodeVal, props]) => {
          const newGesture = new fp.GestureDescription(unicodeVal);

          Object.entries(props.Curls).forEach(([fingerName, curlType]) => {
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
          const letter = String.fromCharCode(
            parseInt(currUnicode.slice(1), 16)
          );

          letterRef.current = letter;
        }
      }
    };

    const motionGestures = () => {
      const letter = letterRef.current;

      const coordRange = (val, min, max) => {
        return val >= min && val <= max;
      };

      let lastTime = Date.now();

      const createZ = () => {
        validGestureShape();
        const indexFingerTip = fingerTipsRef.current['indexTip'];
        const pinkyTip = fingerTipsRef.current['pinkyTip'];
        const now = Date.now();

        const currentLetter = letterRef.current;

        if (!motionEnabled) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
          return;
        }

        if (lastLetterRef.current !== currentLetter) {
          gesturePt.current = null;
          lastLetterRef.current = currentLetter;
        }

        if (letterRef.current === 'J') {
          const xPinky = pinkyTip['x'];
          const yPinky = pinkyTip['y'];

          if (
            coordRange(xPinky, 0, 0.46) &&
            coordRange(yPinky, 0.08, 1.0) &&
            gesturePt.current === null
          ) {
            gesturePt.current = 'firstJ';
            lastTime = now;
            console.log('First J point hit');
          }
          if (
            coordRange(xPinky, 0, 0.46) &&
            coordRange(yPinky, 0.25, 1.0) &&
            gesturePt.current === 'firstJ'
          ) {
            gesturePt.current = 'secondJ';
            lastTime = now;
            console.log('Second J point hit');
          }
          if (
            coordRange(xPinky, 0, 0.61) &&
            coordRange(yPinky, 0.35, 1.0) &&
            gesturePt.current === 'secondJ'
          ) {
            gesturePt.current = 'thirdJ';
            lastTime = now;
            console.log('Third J point hit');
          }
          if (
            coordRange(xPinky, 0.39, 1.0) &&
            coordRange(yPinky, 0.25, 1.0) &&
            gesturePt.current === 'thirdJ'
          ) {
            lastTime = now;
            console.log('Fourth J point hit');
            appendLetter('J');
            gesturePt.current = null;
            // setMessageBody((msg) => msg + 'J');
          }
        }

        if (indexFingerTip && letterRef.current === 'Z') {
          const xIndex = indexFingerTip['x'];
          const yIndex = indexFingerTip['y'];

          if (
            coordRange(xIndex, 0.33, 1.0) &&
            coordRange(yIndex, 0.0, 0.68) &&
            gesturePt.current === null
          ) {
            gesturePt.current = 'firstZ';
            lastTime = now;
            console.log('First Z point hit');
          }
          if (
            coordRange(xIndex, 0.0, 0.33) &&
            coordRange(yIndex, 0.0, 0.68) &&
            gesturePt.current === 'firstZ'
          ) {
            gesturePt.current = 'secondZ';
            lastTime = now;
            console.log('Second Z point hit');
          }
          if (
            coordRange(xIndex, 0.7, 1.0) &&
            coordRange(yIndex, 0.62, 1.0) &&
            gesturePt.current === 'secondZ'
          ) {
            gesturePt.current = 'thirdZ';
            lastTime = now;
            console.log('Third Z point hit');
          }
          if (
            coordRange(xIndex, 0, 0.47) &&
            coordRange(yIndex, 0.61, 1.0) &&
            gesturePt.current === 'thirdZ'
          ) {
            lastTime = now;
            console.log('Fourth Z point hit');
            appendLetter('Z');
            gesturePt.current = null;
            // setMessageBody((msg) => msg + 'Z');
          }
        }

        rafIdRef.current = requestAnimationFrame(createZ);
      };
      rafIdRef.current = requestAnimationFrame(createZ);
    };
    motionGestures();
  }, [motionEnabled]);
};

export default useMotionSigns;
