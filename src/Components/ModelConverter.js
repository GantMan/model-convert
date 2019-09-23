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

  const addAvailableConversions = async addConversions => {
    const newCount = availableConversions + addConversions
    const user = await Auth.currentAuthenticatedUser()
    try {
      const result = await Auth.updateUserAttributes(user, {
        'custom:availableConversions': newCount.toString()
      })

      if (result) {
        setAvailableConversions(newCount)
      }
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="App">
      <header className="App-header tint">
        <h2>Welcome!</h2>
        <p>
          You have {availableConversions} online conversions associated with
          your account.
        </p>
        <a className="App-link" onClick={() => addAvailableConversions(12)}>
          TESTING BUTTON - Give Free Conversions
        </a>
        <hr />
        <StripeBtn />
      </header>
      <div class="body">
        <h2>Select the model you'd like to convert</h2>
        <p>Model selection code will go here</p>
      </div>
    </div>
  )
}

export default withAuthenticator(MC, {
  includeGreetings: true,
  usernameAttributes: 'email'
})
