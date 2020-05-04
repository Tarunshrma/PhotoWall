import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()

const commentsTable = process.env.COMMENTS_TABLE
const commentsIndex = process.env.COMMENTS_INDEX

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const commentId = event.pathParameters.commentId  


  const params = {
    TableName: commentsTable,
    IndexName: commentsIndex,
    KeyConditionExpression: 'commentId = :commentId',
    ExpressionAttributeValues: {
      ':commentId': commentId
    }
  };

  const result = await docClient.query(params).promise();

  if(result.Count !== 0){
    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(
            result.Items[0]
        )
      }
  }  

  return {
    statusCode: 404,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        'error': 'No comment with this id'
    })
  }
}

