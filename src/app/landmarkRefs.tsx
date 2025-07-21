import React, {createRef} from 'react'

interface Keypoint3D {
  x: number;
  y: number;
  z: number;
}

export const landmarksRef = createRef()
export const pixelValsRef = createRef<Keypoint3D[]>();


landmarksRef.current = {
  indexTip: null,
  pinkyTip: null
}






