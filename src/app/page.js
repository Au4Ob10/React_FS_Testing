import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';
import * as fp from "fingerpose";
import handsigns from '../../Components/handsigns'
// import handsigns from '../Components/handsigns'
// import asl_signs from '../components/fs_language/ASL_fingervals.json';
import asl_signs from '../../Components/fs_styles/ASL_fingervals.json'
import Handsigns from '../../Components/handsigns';

const signs = () => {
  let gestureArr = [];


  Object.entries(asl_signs).forEach(([letter, props]) => {

    let newGesture = new GestureDescription(letter);


    Object.entries(props.Curls).forEach(([fingerName, curlType]) => {
      const directionProps = props.directions[fingerName];
      const idxFingerConf = props.indexDirectionConf

      newGesture.addCurl(Finger[fingerName], FingerCurl[curlType], 1.0);


      for (let direction of directionProps) {

        if (fingerName !== "Thumb") {

          if (idxFingerConf && fingerName === "Index") {
            newGesture.addDirection(Finger[fingerName], FingerDirection[direction], 1.0);
          }

          else {
            newGesture.addDirection(Finger[fingerName], FingerDirection[direction], 0.7)
          }
        }
      }
    })


    gestureArr.push(newGesture);


  })



let unicodeVal = "U0041"
console.log(String.fromCharCode(parseInt(unicodeVal.slice(1), 16)))

  return (
    <div><h1>sdfsd</h1></div>
  );
};

export default signs;