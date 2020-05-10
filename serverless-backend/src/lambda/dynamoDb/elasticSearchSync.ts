import { DynamoDBStreamHandler, DynamoDBStreamEvent } from 'aws-lambda'
import 'source-map-support/register'
import * as elasticsearch from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'

const esHost = process.env.ES_ENDPOINT

const es = new elasticsearch.Client({
    hosts: [ esHost ],
    connectionClass: httpAwsEs
  })

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {

    //console.log('Processing events batch from DynamoDB', JSON.stringify(event))

    for (const record of event.Records) {
      console.log('Processing record', JSON.stringify(record))
      if (record.eventName !== 'INSERT') {
        continue
      }
  
      const newItem = record.dynamodb.NewImage

      console.log('New Item', JSON.stringify(newItem))
  
      const postId = newItem.postId.S

      console.log('Post Id: ', postId)
      console.log('Image Url: ', newItem.ImageUrl.S)
      console.log('Descriptioin: ', newItem.description.S)
  
      const body = {
        postId: newItem.postId.S,
        imageUrl: newItem.ImageUrl.S,
        description: newItem.description.S
      }

      console.log('Body to bee inserteed in ESs', JSON.stringify(body))
  
      await es.index({
        index: 'post-index',
        type: 'images',
        id: postId,
        body
      })
  
    }
    
}