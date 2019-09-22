import React from 'react'
import '../App.css'
import { withAuthenticator } from 'aws-amplify-react'

function MC() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>YOU LOGGED IN!</h1>
      </header>
    </div>
  )
}

export default withAuthenticator(MC, {
  includeGreetings: true,
  usernameAttributes: 'email'
})
