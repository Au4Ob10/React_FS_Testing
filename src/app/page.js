"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  HandLandmarker,
  GestureRecognizer,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import hand_landmarker_task from "../../public/models/hand_landmarker.task";

let gestureRecognizer = GestureRecognizer;

let runningMode = "IMAGE";
let webcamRunning = false;
const videoHeight = "360px";
const videoWidth = "480px";
const demosSection = document.getElementById("demos");

const createGestureRecognizer = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );

  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: hand_landmarker_task,
      delegate: "CPU",
    },
    runningMode: runningMode,
  });
  demosSection.classList.remove("invisible");
};

createGestureRecognizer();

const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");
const gestureOutput = document.getElementById("gesture_output");

const hasGetUserMedia = () => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

if (hasGetUserMedia) {
  enableWebcamButton = document.getElementById("webcamButton");
  enableWebcamButton.addEventListener("click", enableCam);
} else {
  console.warn("getUserMedia() is not supported by your browser");
}

const enableCam = (event) => {
  if (!gestureRecognizer) {
    alert("Please wait for gestureRecognizer to load");
    return;
  }
  if (webcamRunning === true) {
    webcamRunning = false;
    enableWebcamButton.innerText = "ENABLE PREDICTIONS";
  } else {
    webcamRunning = true;
    enableWebcamButton.innerText = "DISABLE PREDICTIONS";
  }

  const constraints = {
    video: true,
  };

  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;
    video.addEventListener("loadeddata", predictWebcam);
  });
};

let lastVideoTime = -1;
let results = undefined;

const predictWebcam = async () => {
  const webcamElement = document.getElementById("webcam");

  if (runningMode === "IMAGE") {
    runningMode = "VIDEO";

    await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
  }

  let nowInMs = Date.now();
  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    results = gestureRecognizer.recognizeForVideo(video, nowInMs);
  }

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  const drawingUtils = new DrawingUtils(canvasCtx);

  canvasElement.style.height = videoHeight;
  webcamElement.style.height = videoHeight;
  canvasElement.style.width = videoWidth;
  webcamElement.style.width = videoWidth;
 if (results.landmarks) {
    for (const landmarks of results.landmarks) {
      drawingUtils.drawConnectors(
        landmarks,
        GestureRecognizer.HAND_CONNECTIONS,
        {
          color: "#00FF00",
          lineWidth: 5
        }
      );
      drawingUtils.drawLandmarks(landmarks, {
        color: "#FF0000",
        lineWidth: 2
      });
    }
  }
  canvasCtx.restore();
  if (results.gestures.length > 0) {
    gestureOutput.style.display = "block";
    gestureOutput.style.width = videoWidth;
    const categoryName = results.gestures[0][0].categoryName;
    const categoryScore = parseFloat(
      results.gestures[0][0].score * 100
    ).toFixed(2);
    const handedness = results.handednesses[0][0].displayName;
    gestureOutput.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}`;
  } else {
    gestureOutput.style.display = "none";
  }
  // Call this function again to keep predicting when the browser is ready.
  if (webcamRunning === true) {
    window.requestAnimationFrame(predictWebcam);
  }
}

return (
    <link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet">
<script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script>

<h1>Recognize hand gestures using the MediaPipe HandGestureRecognizer task</h1>

<section id="demos" class="invisible">
  <h2>Demo: Recognize gestures</h2>
  <p><em>Click on an image below</em> to identify the gestures in the image.</p>

  <div class="detectOnClick">
    <img src="https://assets.codepen.io/9177687/idea-gcbe74dc69_1920.jpg" crossorigin="anonymous" title="Click to get recognize!" />
    <p class="classification removed">
  </div>
  <div class="detectOnClick">
    <img src="https://assets.codepen.io/9177687/thumbs-up-ga409ddbd6_1.png" crossorigin="anonymous" title="Click to get recognize!" />
    <p class="classification removed">
  </div>

  <h2><br>Demo: Webcam continuous hand gesture detection</h2>
  <p>Use your hand to make gestures in front of the camera to get gesture classification. </br>Click <b>enable webcam</b> below and grant access to the webcam if prompted.</p>

  <div id="liveView" class="videoView">
    <button id="webcamButton" class="mdc-button mdc-button--raised">
      <span class="mdc-button__ripple"></span>
      <span class="mdc-button__label">ENABLE WEBCAM</span>
    </button>
    <div style="position: relative;">
      <video id="webcam" autoplay playsinline></video>
      <canvas class="output_canvas" id="output_canvas" width="1280" height="720" style="position: absolute; left: 0px; top: 0px;"></canvas>
      <p id='gesture_output' class="output">
    </div>
  </div>
</section>
)
