

useEffect(() => {
    const zGestures = () => {
      const indexVals = indexFingerRef.current;
      if (indexVals) {
        indexTipArr.current.push(indexVals);

        if (indexTipArr.current.length >= 2) {
          const x1: any = indexTipArr.current[0].x;
          const y1 = indexTipArr.current[0].y;
          const x2: any = indexTipArr.current.at(-1).x;
          const y2 = indexTipArr.current.at(-1).y;

          const isBetween = (val,min,max) => {
            return val >= min && val <= max
          }


          const zGesture = new fp.GestureDescription('z-sign');

        
          // const est = GE.estimate(landmarksRef.current, 6.5);

          console.log(
            "x:", x2, "\n", "y:", y2, 
          )

          // console.log(isBetween(x2,0.63,0.8) && isBetween(y2,0.32,0.35))

          setTimeout(() => {
            if (isBetween(x2,0.55,0.87) && isBetween(y2,0.14,0.8) && !gesturePtRef.current) {
              gesturePtRef.current = 'firstPoint';
              console.log(gesturePtRef.current);
              indexTipArr.current = [];
            }
          }, 300);

          setTimeout(() => {
            if (
             isBetween(x2,0.16,0.55) &&
             isBetween(y2,0.14,0.8) &&
           
              gesturePtRef.current === 'firstPoint'
            ) {
              gesturePtRef.current = 'secondPoint';
              console.log(gesturePtRef.current);
              indexTipArr.current = [];
            }
          }, 300);

          setTimeout(() => {
            if ( isBetween(x2,0.55,0.87) &&
             isBetween(y2,0.14,0.8) && gesturePtRef.current === 'secondPoint') {
              gesturePtRef.current = 'thirdPoint';
              console.log(gesturePtRef.current);
              indexTipArr.current = [];
            }
          }, 300);

             setTimeout(() => {
            if ( isBetween(x2,0.16,0.55) &&
             isBetween(y2,0.14,0.8) && gesturePtRef.current === 'thirdPoint') {
              gesturePtRef.current = 'fourthPoint';
              console.log(gesturePtRef.current);
              setMessageBody((msg) => msg + 'Z');
              gesturePtRef.current = null;
              indexTipArr.current = [];
            }
          }, 300);

     
        }

      }
      requestAnimationFrame(zGestures);
    };

    requestAnimationFrame(zGestures);

    return () => {
      gesturePtRef.current = null;
    };
  }, []);