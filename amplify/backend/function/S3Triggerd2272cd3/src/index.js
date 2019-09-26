const aws = require('aws-sdk')
const s3 = new aws.S3()
const axios = require('axios')
const fs = require('fs')

exports.handler = async function(event, context) {
  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name
  const key = event.Records[0].s3.object.key
  const [, baseFolder, ...parts] = key.split('/')

  if (baseFolder === 'results') return

  try {
    let url, file
    // In production - use actual file
    if (process.env.USE_LIVE) {
      file = await s3.getObject({ Bucket: bucket, Key: key }).promise()
      url = 'http://54.146.20.242/upload'
    } else {
      // In local Use bucket stub
      const fileContents = fs.readFileSync(
        '/Users/gantman/Downloads/favicon-16x16.png'
      )
      file = {
        Body: Buffer.from(fileContents, 'utf8'),
        ContentType: 'image/png',
        Metadata: { convert: 'all' }
      }
      url = 'http://localhost:8000/upload'
    }
    console.log('File', { file })
    console.log('MetaData', { data: file.Metadata })

    // TODO: security!!!
    const result = await axios.post(url, {
      file: file.Body,
      content: file.ContentType,
      info: file.Metadata,
      folder: baseFolder,
      fileName: `${parts.join('/')}`
    })

    console.log('API RESULT', result.data)

    await s3
      .putObject({
        Bucket: bucket,
        Key: `public/results/${baseFolder}/${result.data.fileName}`,
        Body: result.data.fileBody
      })
      .promise()
  } catch (error) {
    console.log(error)
  }

  // console.log(`Bucket: ${bucket}`, `Key: ${key}`)
  context.done(null, 'Successfully processed S3 event') // SUCCESS with message
}
