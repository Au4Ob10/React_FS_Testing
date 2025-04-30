import Image from "next/image";
import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose'
import { Libre_Barcode_128 } from "next/font/google";
import * as fp from "fingerpose"
import asl_signs from  '../../Components/fs_styles/ASL_fingervals.json'

import Handsigns  from "../../Components/handsigns";

  const signs = async () => {

    const fingerVals = ["Thumb", "Index", "Middle", "Ring", "Pinky"]
 
    const signList = {}
    let signArr = []

    const letterList = Object.keys(asl_signs) 

    
        // if (fingerProps.includes("contrib")) {
        //   currGesture.addCurl(Finger[currFinger], FingerCurl[curlType], fingerVals[currLetter][currFinger]["contrib"])
        // }


    for (let currLetter of letterList) {

     let currGesture = new GestureDescription(currLetter)

      for (let currFinger of fingerVals) {
      
        const fingerDirection = asl_signs[currLetter][currFinger]["directions"]
        const curlType = asl_signs[currLetter][currFinger]["curlType"]


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
      
    
      signList[currLetter.toLowerCase() + "Sign"] = currGesture

   
      
    
   }

  
console.log(Handsigns)

  

  return (
<div><h1>sdfsd</h1></div>
  );


  }

  export default signs


        
       
        
       



        // handSignsMap.set("gestures", [ "t" {"name", currFinger} ])
        // console.log(handSignsMap)

       


        // gestures: [ t { name: 'thumbs_up', curls: [Object], directions: [Object] } ]
    
  