import ibm from 'ibm-cos-sdk'
import dotenv from `dotenv`

dotenv.config()

const {
  IBM_S3_ENDPOINT,
  IBM_S3_APIKEY,
  IBM_S3_SERVICE_INSTANCE_ID,
  IBM_S3_BUCKET,
} = process.env


const cos = new ibm.S3({
  endpoint: IBM_S3_ENDPOINT,
  apiKeyId: IBM_S3_APIKEY,
  serviceInstanceId: IBM_S3_SERVICE_INSTANCE_ID,
})

const uploadFile = ({ fileName, body, meta }) => {
  const result = await cos.putObject({
    Bucket: IBM_S3_BUCKET,
    Key: fileName,
    Body: body,
    Metadata: meta,
  }).promise()
  return result
}

export default {
  uploadFile
}