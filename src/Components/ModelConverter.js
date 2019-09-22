import React from 'react'
import '../App.css'
import { withAuthenticator } from 'aws-amplify-react'
import StripeBtn from './StripeButton'

function MC() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>YOU LOGGED IN!</h1>
        <StripeBtn />
      </header>
    </div>
  )
}

export default withAuthenticator(MC, {
  includeGreetings: true,
  usernameAttributes: 'email'
})
