import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  createContext,
} from 'react';
import { motionSigns } from './motionSignsDetect';
import staticSignsDetect from './staticSignsDetect';
import { handLandmarks } from '../page';

const GestureToggleButton = () => {
  const [detectMotionSigns, setDetectMotionSigns] = useState<boolean | null>(
    false
  );

  const landmarks = useContext(handLandmarks);

  if (detectMotionSigns === true)

  motionSigns(landmarks, detectMotionSigns);
  staticSignsDetect(landmarks, detectMotionSigns);

  return (
    <button onClick={() => setDetectMotionSigns((motion) => !motion)}>
      Toggle Sign Detection
    </button>
  );
};


export default GestureToggleButton;
