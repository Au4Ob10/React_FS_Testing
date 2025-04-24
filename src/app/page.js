import Image from "next/image";
import indexfinger from "../../Components/fingerVals/indexFinger.json"
import middle from "../../Components/fingerVals/middle.json"
import pinky from "../../Components/fingerVals/pinky.json"
import thumb from "../../Components/fingerVals/thumb.json"
import sign from "../../Components/fingerVals/newCombined.json"
import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose'
import { Libre_Barcode_128 } from "next/font/google";


const homeFunc = () => {

  const handSigns = () => {

    const fingers = ["Thumb", "Index", "Middle", "Ring", "Pinky"]

    let handSigns = {};
    const letterList = Object.keys(sign)

    for (let currLetter of letterList) {

      let currGesture = new GestureDescription(currLetter)

      for (let currFinger of fingers) {

        const fingerDirection = sign[currLetter][currFinger]["directions"]
        const curlType = sign[currLetter][currFinger]["curlType"]

        currGesture.addCurl(Finger[currFinger], FingerCurl[curlType], 1)

        if (currFinger === "indexFinger" && currLetter === "A") {
          currGesture.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.70);
          currGesture.addDirection(Finger.Index, FingerDirection.DiagonalDownLeft, 1.0);
        }

        else {
          for (let direction of [fingerDirection]) {
            currGesture.addDirection(Finger[currFinger], FingerDirection[direction], 0.70)
          }
        }

        handSigns[currLetter + "Sign"] = currGesture
        
      }
    }





  }

  return (
    <div>
      <h1>Sample</h1>
    </div>
  );


}

export default homeFunc;