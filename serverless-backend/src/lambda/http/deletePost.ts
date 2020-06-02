import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const docClient = new AWS.DynamoDB.DocumentClient()

const postsTable = process.env.POSTS_TABLE

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event)
    
    const postId = event.pathParameters.postId
    
    const params = {
        TableName: postsTable,
        Key:{
            "postId":postId
        }
    };

    await docClient.delete(params,(error,_data)=>{
        if(error){
            console.log(error.message)
        }else{
            console.log("Succesfully deleted post: ",postId)
        }
    }).promise();

    return {
        statusCode: 200,
        headers:{
          'Access-Control-Allow-Origin':'*'
        },
        body: null
      }
})

handler.use(
  cors({
    credentials: true
  })
)