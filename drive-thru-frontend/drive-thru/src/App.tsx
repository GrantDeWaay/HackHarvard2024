import React from "react";
import "./App.css";
import AudioRecorder from "./components/AudioRecorder";
import CheckoutList from "./components/CheckoutList";

function App() {
  return (
    <div className="App">
      <AudioRecorder />
      <CheckoutList items={["burger -t", "fries -s"]}/>
    </div>
  );
}

export default App;
