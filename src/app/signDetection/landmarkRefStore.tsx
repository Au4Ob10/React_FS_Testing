import { create } from 'zustand'


interface landmarkState {
    landmarks: any
    setLandmarks: (val: any) => void;
    getLandmarks: () => any;
}


const landmarksRefStore = create<landmarkState>((set, get) => ({

    landmarks: null,
    
    setLandmarks: (currLm) => set({landmarks: currLm}),

    getLandmarks: () => get().landmarks
}))

export type {landmarkState}
export {landmarksRefStore}


