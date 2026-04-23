import { create } from 'zustand'


// interface videoRefState {

//     videoRef: any;
//     setVideoRef: (ref: any) => void
//     getVideoRef: (ref: any) => void
// }


const useVideoRefStore = create((set,get) => {

    videoRef: null;

    setVideoRef: (ref) => set({videoRef: ref})

    getVideoRef:  () => get().videoRef

})

export {useVideoRefStore}