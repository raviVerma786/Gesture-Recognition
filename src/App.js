//HandPose Detection
    //Install Dependencies 
    //Import Dependencies 
    //Setup Webcam and Canvas 
    //Define references to those 
    //Load HandPose 
    //detect function
    //Drawing uttilities for tensor flow
    //Draw Functions

//Gesture Recognition Model
    //Install fingerpose
    //add use state
    //Import emojis and finferpose
    //Update detect hunction for gesture handling
    //setup hook and emoji object
    //add emoji display to the screen


// import logo from './logo.svg';
import React, {useRef,useState} from 'react';
import * as tf from '@tensorflow/tfjs'
import * as handpose from '@tensorflow-models/handpose'
import Webcam from 'react-webcam'
import './App.css';
import { drawHand } from './utilities';
import * as fp from "fingerpose";
import victory from "./victory.png";
import thumbs_up from "./thumbs_up.png";
// import thumbs_down from "./thumbs_up.png";


function App() {
  const webcamRef =useRef(null);
  const canvasRef =useRef(null);

  const [emoji,setEmoji] =useState(null);
  const images = {thumbs_up:thumbs_up, victory:victory};
  const runHandpose = async() =>{
    const net = await handpose.load();
    console.log("HandPose model loaded.");

    // Loop and Detect Hands
    setInterval(() =>{
      detect(net)
    },100)
  };

  const detect = async (net) =>{
    //check data is availble
    if(typeof webcamRef.current !=="undefined" && 
        webcamRef.current!== null && 
        webcamRef.current.video.readyState===4){

          //get video properties
          const video = webcamRef.current.video;
          const videoWidth = webcamRef.current.video.videoWidth;
          const videoHeight = webcamRef.current.video.videoHeight;
          //set video height and width
          webcamRef.current.video.width =videoWidth;
          webcamRef.current.video.height =videoHeight;

          //set canvas height and width
          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;


          //make detection
          const hand = await net.estimateHands(video);
          // console.log(hand);

          if(hand.length >0){
            const GE = new fp.GestureEstimator([
              fp.Gestures.VictoryGesture,
              fp.Gestures.ThumbsUpGesture,
            ])
            const gesture = await GE.estimate(hand[0].landmarks,8);
            // console.log(gesture);
            if(gesture.gestures !== undefined && gesture.gestures.length >0){
              const confidence = gesture.gestures.map((prediction) => prediction.score);
              // console.log(confidence);
              const maxConfidence = confidence.indexOf(
                Math.max.apply(null,confidence)
              );
                // console.log(maxConfidence);
              setEmoji(gesture.gestures[maxConfidence].name);
              console.log(emoji);
            }

          }

          //draw mesh
          const ctx = canvasRef.current.getContext("2d");
          drawHand(hand,ctx);
        }
    
  }

  runHandpose();



  return (
    <div className="App">
      <header className="App-header">
        <Webcam ref={webcamRef}
        style={{
          position:"absolute",
          marginLeft:"auto",
          marginRight:"auto",
          left:0,
          right:0,
          textAlign:"center",
          zindex:9,
          width:640,
          height:480
        }}/>
        <canvas ref={canvasRef}
        style={{
          position:"absolute",
          marginLeft:"auto",
          marginRight:"auto",
          left:0,
          right:0,
          textAlign:"center",
          zindex:9,
          width:640,
          height:480
        }}/>

        {emoji !==null ? <img src ={images[emoji]} style={{
            position:"absolute",
            marginLeft:"auto",
            marginRight:"auto",
            left:400,
            bottom:500,
            right:0,
            textAlign:"center",
            height:100,
        }}/>:""}
      </header>
    </div>
  );
}

export default App;
