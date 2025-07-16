        setTimeout(() => {
            if (
              isBetween(x2, 0.55, 0.87) &&
              isBetween(y2, 0.14, 0.8) &&
              gesturePtRef.current === 'firstPoint'
            ) {
              console.log(gesturePtRef.current);
              gesturePtRef.current = 'secondPoint'
            
            }
          }, 300);

          setTimeout(() => {
            if (
              isBetween(x2, 0.16, 0.55) &&
              isBetween(y2, 0.14, 0.8) &&
              gesturePtRef.current === 'secondPoint'
            ) {
    
              console.log(gesturePtRef.current);
                        gesturePtRef.current = 'thirdPoint';
              indexTipArr.current = [];
            }
          }, 300);

          setTimeout(() => {
            if (
              isBetween(x2, 0.55, 0.87) &&
              isBetween(y2, 0.14, 0.8) &&
              gesturePtRef.current === 'thirdPoint'
            ) {
              gesturePtRef.current = 'fourthPoint';
              console.log(gesturePtRef.current);
        
            }
          }, 300);

          setTimeout(() => {
            if (
              isBetween(x2, 0.16, 0.55) &&
              isBetween(y2, 0.14, 0.8) &&
              gesturePtRef.current === 'fourthPoint'
            ) {
              console.log(gesturePtRef.current);
              setMessageBody((msg) => msg + 'Z');
              gesturePtRef.current = 'firstPoint'
            }
          }, 300);
        }
      }
    };