import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const connectionTable = process.env.CONNECTION_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    console.log('Websocket connect', event)

    const connectionId = event.requestContext.connectionId
    const timestamp = new Date().toISOString()
  
    const item = {
      id: connectionId,
      timestamp
    }
  
    console.log('Storing item: ', item)
  
    await docClient.put({
      TableName: connectionTable,
      Item: item
    }).promise()
  
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          response: "Connected Successfully!"
        }
      )
    }

}