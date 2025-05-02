import Image from "next/image";
import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose'
import { Libre_Barcode_128 } from "next/font/google";
import * as fp from "fingerpose"
import asl_signs from  '../../Components/fs_styles/ASL_fingervals.json'

import Handsigns  from "../../Components/handsigns";


const signs = async () => {

  let signArr = [];
 

Object.values(asl_signs).forEach((letter) => {

  const fingerName = ["Thumb", "Index", "Middle", "Ring", "Pinky"]

   let newGesture = new GestureDescription(letter);

 Object.values(letter.Curls).map((curlType, finger) => {
    newGesture.addCurl(fingerName[finger], curlType, 1)
 })

 Object.values(letter.directions).map((fDirection, finger) => {
  if (fDirection.length > 0) {
  newGesture.addDirection(fingerName[finger], fDirection, 0.7)
  }
 })

signArr.push(newGesture)

   })

console.log(signArr)


  return (
<div><h1>sdfsd</h1></div>
  );
}
  // }

  export default signs


        
       
        
       



        // handSignsMap.set("gestures", [ "t" {"name", currFinger} ])
        // console.log(handSignsMap)

       


        // gestures: [ t { name: 'thumbs_up', curls: [Object], directions: [Object] } ]
    
  