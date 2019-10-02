import React, { useState } from 'react'
import ModelConverter from './Components/ModelConverter'
import './App.css'

const App = () => {
  const [ready, setReady] = useState(false)
  if (ready) {
    return <ModelConverter />
  }
  return (
    <div className="App">
      <header className="App-header">
        <img
          src="logo192.png"
          className="App-logo animated fadeInDown"
          alt="logo"
        />
        <h2>REFORM</h2>
        <h4 className="dancer animated tada delay-1s">
          Online Model Converter
        </h4>
        <p>
          Upload your Keras model and enjoy conversions to TensorFlow,
          TensorFlow Lite, and TensorFlow.js
        </p>
        <a className="App-link" onClick={() => setReady(true)} href="#">
          Get Started
        </a>
      </header>
    </div>
  )
}

export default App
