import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Example from "./Mic";
import MyAudioPlayer from "./Audio";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Example />
        <MyAudioPlayer />
      </header>
    </div>
  );
}

export default App;
