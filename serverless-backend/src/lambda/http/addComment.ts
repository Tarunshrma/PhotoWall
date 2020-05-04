import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

const docClient = new AWS.DynamoDB.DocumentClient()

const postsTable = process.env.POSTS_TABLE
const commentsTable = process.env.COMMENTS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  
  const postId = event.pathParameters.postId;

  const postExist = await isPostExist(postId); 

  if(!postExist){
      return {
          statusCode: 404,
          headers:{
            'Access-Control-Allow-Origin': '*'
          },
          body:JSON.stringify({
            error:"Post not exist"
          })
      }
  }

  const parsedBody  = JSON.parse(event.body);
  const timeStamp = new Date().toISOString();
  const commentId = uuid.v4();
  
  const newComment = {
      postId: postId,
      timestamp: timeStamp,
      commentId: commentId,
      comment : parsedBody.comment  
  }

 await docClient.put({
    TableName: commentsTable,
    Item: newComment
  }).promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        newComment
    })
  }
}

async function isPostExist(postId: string)
{
    const params = {
        TableName : postsTable,
        Key: {
            postId: postId
        }
    };

    const result = await docClient.get(params).promise();

    return !!result.Item; 
} 