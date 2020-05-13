import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const docClient = new AWS.DynamoDB.DocumentClient()

const postsTable = process.env.POSTS_TABLE

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)

  //TODO: Replace it with query as scan is lesss performant
  const result = await docClient.scan({
    TableName: postsTable
  }).promise()

  const posts = result.Items

  return {
    statusCode: 200,
    body: JSON.stringify({
        posts
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)
