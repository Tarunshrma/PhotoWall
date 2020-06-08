import {  APIGatewayProxyResult } from 'aws-lambda'

export class ApiResponseHelper{

    generateDataSuccessResponse(statusCode: number,key: string, items: any): APIGatewayProxyResult{
        return {
            statusCode: statusCode,
            headers:{
              'Access-Control-Allow-Origin':'*'
            },
            body: JSON.stringify({
                [key]: items
            })
          }
    }

    generateCustomObjectDataSuccessResponse(statusCode: number, object: any): APIGatewayProxyResult{
        return {
            statusCode: statusCode,
            headers:{
              'Access-Control-Allow-Origin':'*'
            },
            body: JSON.stringify({
                object
            })
          }
    }
    
    generateEmptySuccessResponse(statusCode: number): APIGatewayProxyResult{
        return {
            statusCode: statusCode,
            headers:{
              'Access-Control-Allow-Origin':'*'
            },
            body: null
          }
    }

    generateErrorResponse(statusCode: number,message:string): APIGatewayProxyResult{
        return {
            statusCode: statusCode,
            headers:{
              'Access-Control-Allow-Origin':'*'
            },
            body: JSON.stringify({
              message
            })
          }
    }
}