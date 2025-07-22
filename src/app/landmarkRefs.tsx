import React, {createRef} from 'react'

interface Keypoint3D {
  x: number;
  y: number;
  z: number;
}

export const fingerTipsRef = createRef()
export const pixelValsRef = createRef<Keypoint3D[]>();


fingerTipsRef.current = {
  indexTip: null,
  pinkyTip: null
}






