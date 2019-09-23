import React, { useState } from 'react'
import ModelConverter from './Components/ModelConverter'
import logo from './logo.svg'
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
        <h2 className="animated tada delay-1s">
          Simple Online Model Converter
        </h2>
        <a className="App-link" onClick={() => setReady(true)} href="#">
          Get Started
        </a>
      </header>
    </div>
  )
}

export default App
