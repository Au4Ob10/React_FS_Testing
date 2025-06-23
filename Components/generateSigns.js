import * as fp from 'fingerpose'
import aslSigns from '../components/fs_language/ASL_fingervals.json';
import mslSigns from '../components/fs_language/Mexican_fingervals_static.json'
// import sslSigns from '../components/fs_language/spanish_fingervals.json';
// import fslSigns from '../components/fs_language/French_fingervals.json';


const signs = (signsJSON) => {

  let gestureArr = [];

  // gestureArr.push(fp.Gestures.ThumbsUpGesture)

  Object.entries(signsJSON).forEach(([unicodeVal, props]) => {


    let letter = String.fromCharCode(parseInt(unicodeVal.slice(1), 16))

    const newGesture = new fp.GestureDescription(letter);

  Object.entries(props.Curls).forEach(([fingerName, curlType]) => {
      const directionProps = props.directions[fingerName];
      const curlConfidence = props.curlConf[fingerName]
      const directionConf = props.directionConf[fingerName]


      newGesture.addCurl(fp.Finger[fingerName], fp.FingerCurl[curlType], curlConfidence);

      if (directionProps.length > 0) {

        for (let direction of directionProps) {

          newGesture.addDirection(fp.Finger[fingerName], fp.FingerDirection[direction], directionConf);
        }
      }
    }

    )
    gestureArr.push(newGesture)

  })



  return gestureArr

}

const gestArray = signs(mslSigns)

export default gestArray




