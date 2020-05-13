import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import {getUserIdFromToken} from '../../utils/utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const postsTable = process.env.POSTS_TABLE
const bucketName = process.env.POST_IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)

  const parsedBody  = JSON.parse(event.body);
  const postId = uuid.v4();
  const imageId = uuid.v4();

  const authToken = event.headers.Authorization;
  const userId = getUserIdFromToken(authToken);

  const url = getUploadUrl(imageId)

  const newPost = {
      postId: postId,
      userId: userId,
      ImageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`,
      ...parsedBody
  }

 await docClient.put({
    TableName: postsTable,
    Item: newPost
  }).promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        newPost: newPost,
        uploadUrl: url
    })
  }
}

function getUploadUrl(imageId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: 300
  })
}