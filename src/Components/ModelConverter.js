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
      <header className="App-header">
        <h1>Welcome!</h1>
        <p>
          You have {availableConversions} online conversions associated with
          your account.
        </p>
        <a className="App-link" onClick={() => addAvailableConversions(12)}>
          FOR TESTING - Give Free Conversions!
        </a>
        <StripeBtn />
      </header>
    </div>
  )
}

export default withAuthenticator(MC, {
  includeGreetings: true,
  usernameAttributes: 'email'
})
