import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const connectionTable = process.env.CONNECTION_TABLE


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Websocket disconnect', event)

  const connectionId = event.requestContext.connectionId
  const key = {
      id: connectionId
  }

  console.log('Removing item with key: ', key)

  await docClient.delete({
    TableName: connectionTable,
    Key: key
  }).promise()

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        response: "Disconnected Successfully!"
      }
    )
  }
}