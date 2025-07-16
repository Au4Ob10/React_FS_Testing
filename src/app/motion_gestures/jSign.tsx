// useEffect(() => {
  //   const jRecognize = () => {
  //     const pinkyVals = pinkyRef.current;

  //     if (pinkyVals) {
  //       pinkyTipArr.current.push({
  //         x: pinkyVals.x,
  //         y: pinkyVals.y,
  //         z: pinkyVals.z,
  //       });

  //       const x1 = pinkyTipArr.current[0].x;
  //       const x2 = pinkyTipArr.current.at(-1).x;

  //       const y1 = pinkyTipArr.current[0].y;
  //       const y2 = pinkyTipArr.current.at(-1).y;

  //       console.log('x:', x2, '\n', 'y:', y2);

  //       setTimeout(() => {
  //         if (x2 < -0.01 && y2 < -0.06) {
  //           gesturePtRef.current = 'first point';
  //           console.log(gesturePtRef.current);
  //         }
  //       }, 300);

  //       setTimeout(() => {
  //         if (
  //           x2 > 0.02 &&
  //           y2 > 0.01 &&
  //           gesturePtRef.current === 'first point'
  //         ) {
  //           gesturePtRef.current = 'second point';
  //           console.log(gesturePtRef.current);
  //         }
  //       }, 300);

  //       setTimeout(() => {
  //         if (
  //           x2 > 0.05 &&
  //           y2 > -0.016 &&
           
  //           gesturePtRef.current === 'second point'
  //         ) {
  //           gesturePtRef.current = 'third point';
  //           console.log(gesturePtRef.current);

  //           console.log('J');
  //           setMessageBody((msg) => msg + 'J');
  //           letterRef.current = null;
  //         }
  //       }, 300);

  //       // setTimeout(() => {
  //       //   if (
  //       //     isBetween(x2, 0.05, 0.08) &&
  //       //     isBetween(y2, -0.0253, -0.0216) &&
  //       //     gesturePtRef.current === 'third point'
  //       //   ) {
  //       //     gesturePtRef.current = 'fourth point';
  //       //     console.log(gesturePtRef.current);

  //       //     console.log('J');
  //       //     setMessageBody((msg) => msg + 'J');
  //       //     letterRef.current = null;
  //       //   }
  //       // }, 300);
  //     }
  //     requestAnimationFrame(jRecognize);
  //   };
  //   requestAnimationFrame(jRecognize);

  //   return () => {
  //     gesturePtRef.current = null;
  //     pinkyTipArr.current = [];
  //   };
  // }, []);