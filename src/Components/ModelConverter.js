import React, { useState, useEffect } from 'react'
import '../App.css'
import { withAuthenticator } from 'aws-amplify-react'
import uuid from 'uuid/v4'
import { Auth, Storage } from 'aws-amplify'
import StripeBtn from './StripeButton'

const UploadSection = props => {
  const { modelFile, ready } = props.info
  if (modelFile && !ready) {
    return (
      <div className="spacer">
        <a className="App-link inverse" onClick={props.uploadClick}>
          Upload Model
        </a>
      </div>
    )
  } else {
    return null
  }
}

function ModelConvertor() {
  const fileRef = React.createRef()
  const [modelFileInfo, setModelFileInfo] = useState({})
  const [watchKey, setWatchKey] = useState(null)
  const [availableConversions, setAvailableConversions] = useState(0)

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
    } catch (error) {
      console.log(error)
    }
  }

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

  useEffect(() => {
    if (!watchKey) return

    let hasResult
    let myInterval
    const myWatchKey = watchKey

    myInterval = setInterval(async () => {
      // First thing's first kill top level watchKey to stop dupes
      setWatchKey(null)
      // Poll for result file
      const [baseFolder, ..._parts] = myWatchKey.split('/')
      const resultFolder = `results/${baseFolder}/`
      const contents = await Storage.list(resultFolder)
      const isDone = !!contents.length
      if (isDone) {
        const publicKey = await Storage.get(`${resultFolder}result.zip`)
        // subtract a conversion
        addAvailableConversions(-1)
        console.log('DIS IS IT!', publicKey)
        setModelFileInfo({ download: publicKey, message: 'Download Result' })
        clearInterval(myInterval)
        return
      }

      console.log('no key yet :(')
    }, 3000)
  }, [watchKey, setModelFileInfo, modelFileInfo, addAvailableConversions])

  useEffect(() => {
    const { modelFile, ready } = modelFileInfo
    // leave if we're not good to upload
    if (!ready || !modelFile) return
    // upload - it triggers lamba!
    Storage.put(`${uuid()}/${modelFile.name}`, modelFile, {
      contentType: modelFile.type,
      metadata: { types: 'all' }
    })
      .then(result => {
        // Watch for result
        // TODO: This is the same file name right now
        setWatchKey(result.key)
        // clear it out
        setModelFileInfo({ message: 'Processing...' })
      })
      .catch(error => setModelFileInfo({ error: 'Failed to upload' }))
  }, [modelFileInfo, setWatchKey, setModelFileInfo])

  const setFile = event => {
    setModelFileInfo({
      ready: false,
      message: 'File Selected',
      modelFile: event.target.files[0]
    })
  }

  return (
    <div className="App">
      <header className="App-header tint">
        <h2>REFORM</h2>
        <p>
          You have {availableConversions} online conversions associated with
          your account.
        </p>
        {/* <a className="App-link" onClick={() => addAvailableConversions(12)}>
          TESTING BUTTON - Give Free Conversions
        </a> */}
        <hr />
        <StripeBtn onSuccess={() => addAvailableConversions(12)} />
      </header>
      {availableConversions > 0 && (
        <div className="body">
          <h2>Select the model you'd like to convert</h2>
          <UploadSection
            info={modelFileInfo}
            uploadClick={() =>
              setModelFileInfo({
                ...modelFileInfo,
                message: 'Uploading',
                ready: true
              })
            }
          />
          <input
            type="file"
            name="fileupload"
            id="fileupload"
            onChange={setFile}
            ref={fileRef}
          />
          <a href={modelFileInfo.download}>{modelFileInfo.message}</a>
        </div>
      )}
    </div>
  )
}

export default withAuthenticator(ModelConvertor, {
  includeGreetings: true,
  usernameAttributes: 'email'
})
