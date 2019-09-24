import React, { useState, useEffect } from 'react'
import '../App.css'
import { withAuthenticator } from 'aws-amplify-react'
import { Auth } from 'aws-amplify'
import StripeBtn from './StripeButton'

function MC() {
  const fileRef = React.createRef()
  const [modelFile, setModelFile] = useState(null)
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

  const setFile = event => {
    console.log(event.target.files[0])
    setModelFile(event.target.files[0])
  }

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
      <div className="body">
        <h2>Select the model you'd like to convert</h2>
        <p>{modelFile && modelFile.name}</p>
        <input
          type="file"
          name="fileupload"
          id="fileupload"
          onChange={setFile}
          ref={fileRef}
        />
      </div>
    </div>
  )
}

export default withAuthenticator(MC, {
  includeGreetings: true,
  usernameAttributes: 'email'
})
