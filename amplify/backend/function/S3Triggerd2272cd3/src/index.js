const aws = require('aws-sdk')
const s3 = new aws.S3()

exports.handler = async function(event, context) {
  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name
  const key = event.Records[0].s3.object.key
  const [, baseFolder, ...parts] = key.split('/')

  if (baseFolder === 'results') return

  console.log('passed baseFolder')

  try {
    const file = await s3.getObject({ Bucket: bucket, Key: key }).promise()
    console.log('File', { file })
    console.log('MetaData', { data: file.Metadata })

    // TODO: security!!!
    // const result = await axios.post('your express server', {
    //   body: {
    //     file: file.Body,
    //     types: file.MetaData
    //   }
    // })

    // const [newKey] = fileKey.split(0)

    await s3
      .putObject({
        Bucket: bucket,
        Key: `public/results/${baseFolder}/${parts.join('/')}`,
        Body: file.Body
      })
      .promise()
  } catch (error) {
    console.log(error)
  }

  // console.log(`Bucket: ${bucket}`, `Key: ${key}`)
  context.done(null, 'Successfully processed S3 event') // SUCCESS with message
}
