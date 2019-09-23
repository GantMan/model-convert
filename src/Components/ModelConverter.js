import React, { useState, useEffect } from 'react'
import '../App.css'
import { withAuthenticator } from 'aws-amplify-react'
import { Auth } from 'aws-amplify'
import StripeBtn from './StripeButton'

function MC() {
  const [availableConversions, setAvailableConversions] = useState(0)

  useEffect(() => {
    const getUserAttrs = async () => {
      try {
        const { attributes } = await Auth.currentUserInfo()

        if (attributes['custom:availableConversions']) {
          setAvailableConversions(
            Number(attributes['custom:availableConversions'])
          )
        }
      } catch (error) {
        console.log(error)
      }
    }

    getUserAttrs()
  }, [availableConversions, setAvailableConversions])

  const updateAvailableConversions = async numLeft => {
    const user = await Auth.currentAuthenticatedUser()
    try {
      const result = await Auth.updateUserAttributes(user, {
        'custom:availableConversions': numLeft.toString()
      })

      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>YOU LOGGED IN!</h1>
        <p>You have {availableConversions} left.</p>
        <button onClick={() => updateAvailableConversions(10)}>
          Free Conversions!
        </button>
        <StripeBtn />
      </header>
    </div>
  )
}

export default withAuthenticator(MC, {
  includeGreetings: true,
  usernameAttributes: 'email'
})
