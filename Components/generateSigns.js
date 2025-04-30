import fingerVals from './fingerVals/ASL_fingervals.json';
import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose'

  const signs = async () => {

    const fingers = ["Thumb", "Index", "Middle", "Ring", "Pinky"]
 
    const handSigns = {}
    const handSignsArr = []

    const letterList = Object.keys(fingerVals) 
    
    for (let currLetter of letterList) {

      let currGesture = new GestureDescription(currLetter)


      for (let currFinger of fingers) {

       

        const fingerDirection = fingerVals[currLetter][currFinger]["directions"]
        const curlType = fingerVals[currLetter][currFinger]["curlType"]

        

        // if (fingerProps.includes("contrib")) {
        //   currGesture.addCurl(Finger[currFinger], FingerCurl[curlType], fingerVals[currLetter][currFinger]["contrib"])
        // }


        // else {
          for (let direction of [fingerDirection]) {
            currGesture.addCurl(Finger[currFinger], FingerCurl[curlType], fingerVals[currLetter], 1)
            currGesture.addDirection(Finger[currFinger], FingerDirection[direction], 0.70)
          }
        // }

        // handSignsMap.set("gestures", [ "t" {"name", currFinger} ])
        // console.log(handSignsMap)

       


        // gestures: [ t { name: 'thumbs_up', curls: [Object], directions: [Object] } ]
    
      }
      

    
      // handSigns[currLetter.toLowerCase() + "Sign"] = currGesture
      
    
   }

  
// console.log(handSigns)


// console.log(GE)


    // WSign: t {
    //   name: 'W',
    //   curls: {
    //     '0': [Array],
    //     '1': [Array],
    //     '2': [Array],
    //     '3': [Array],
    //     '4': [Array]
    //   },


// gestures: [ t { name: 'thumbs_up', curls: [Object], directions: [Object] } ]

  

  return (
handSigns
  );


  }

export default signs;