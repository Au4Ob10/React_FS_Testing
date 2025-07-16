const drawLandmarks = (landmarksArray) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!canvas || !ctx || !landmarksArray || landmarksArray.length === 0)
        return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'green';
      ctx.lineWidth = 2;

      const handJoints = {
        thumb: [0, 1, 2, 3, 4],
        index: [5, 6, 7, 8],
        middle: [9, 10, 11, 12],
        ring: [13, 14, 15, 16],
        pinky: [17, 18, 19, 20],
        palm: [5, 9, 13, 17, 0, 5],
      };

      Object.values(handJoints).forEach((jointArr) => {
        const arrLen = jointArr.length;
        const lineStartArr = jointArr.slice(0, arrLen - 1);
        const lineEndArr = jointArr.slice(1);

        lineStartArr.forEach((startIdx, i) => {
          const lineStart = landmarksArray[0][startIdx];
          const lineEnd = landmarksArray[0][lineEndArr[i]];

          ctx.beginPath();
          ctx.moveTo(lineStart.x * canvas.width, lineStart.y * canvas.height);
          ctx.lineTo(lineEnd.x * canvas.width, lineEnd.y * canvas.height);
          ctx.stroke();
        });
      });

      ctx.fillStyle = 'red';
      landmarksArray.forEach((landmarks) => {
        landmarks.forEach((landmark) => {
          const x = landmark.x * canvas.width;
          const y = landmark.y * canvas.height;

          ctx.beginPath();
          ctx.arc(x, y, 2, 0, 2 * Math.PI);
          ctx.fill();
        });
      });
    };
