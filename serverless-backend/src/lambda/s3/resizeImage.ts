import { SNSEvent, SNSHandler, S3EventRecord } from 'aws-lambda'
import 'source-map-support/register'
import {ImageStorageService} from '../../services/s3/ImageStorageService' 
import {createLogger} from '../../utils/logger'

const imageStorageService = new ImageStorageService();
const logger = createLogger('resizeImage')

export const handler: SNSHandler = async (event: SNSEvent) => {
  logger.log('Processing SNS event ', JSON.stringify(event))
  for (const snsRecord of event.Records) {
    const s3EventStr = snsRecord.Sns.Message
    console.log('Processing S3 event', s3EventStr)
    const s3Event = JSON.parse(s3EventStr)

    for (const record of s3Event.Records) {
      await processImage(record)
    }
  }
}

async function processImage(record: S3EventRecord) {
  const key = record.s3.object.key
  logger.log('Processing S3 item with key: ', key)
  imageStorageService.resizeAndUploadImage(key);
}