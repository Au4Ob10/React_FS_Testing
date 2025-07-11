import React, { useEffect, useRef, useState, useContext, createContext } from 'react';
import { motionSigns } from './motionSigns';

const GestureToggleButton = ({landmarks}) => {

   const [detectMotionSigns, setDetectMotionSigns] = useState(false);

   motionSigns(landmarks, detectMotionSigns)

   return (
    <button onClick={() => setDetectMotionSigns(true)}>
        Toggle Sign Detection
    </button>
   )
   
}

export default GestureToggleButton;