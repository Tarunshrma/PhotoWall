import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { Bool } from 'aws-sdk/clients/clouddirectory'

const docClient = new AWS.DynamoDB.DocumentClient()

const postsTable = process.env.POSTS_TABLE
const commentsTable = process.env.COMMENTS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const postId = event.pathParameters.postId  
  const postExist = await isPostExist(postId);

  if(!postExist){
      return {
          statusCode: 404,
          headers: {
              'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
              error:"Post not exist"
          })
      }
  }  

  const comments = await getCommentsFromPostId(postId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        comments
    })
  }
}

async function getCommentsFromPostId(postId: string) {

    const params = {
        TableName: commentsTable,
        KeyConditionExpression: 'postId = :postId',
        ExpressionAttributeValues: {
          ':postId': postId
        }
      };

    const result = await docClient.query(params).promise();

    return result.Items;
}

async function isPostExist(postId: string): Promise<Bool>
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
