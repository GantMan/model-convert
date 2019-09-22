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
        <img src={logo} className="App-logo" alt="logo" />
        <p>Let's Rock</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <hr />
        <button onClick={() => setReady(true)}>Let's Do This</button>
      </header>
    </div>
  )
}

export default App
