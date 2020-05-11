import { CustomAuthorizerHandler, CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'


export const handler: CustomAuthorizerHandler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {

    try{
        verifyToken(event.authorizationToken)
        console.log('User is authorized')

        return {
            principalId: "user",
            policyDocument: {
              Version: '2012-10-17',
              Statement: [
                {
                  Action: 'execute-api:Invoke',
                  Effect: 'Allow',
                  Resource: '*'
                }
              ]
            }
          }
        } catch (e) {
          console.log('User was not authorized', e.message)
      
          return {
            principalId: 'user',
            policyDocument: {
              Version: '2012-10-17',
              Statement: [
                {
                  Action: 'execute-api:Invoke',
                  Effect: 'Deny',
                  Resource: '*'
                }
              ]
            }
          }
        }
}

function verifyToken(authToken: String){
    if(!authToken)
        throw new Error('No authorization header')

    if(!authToken.toLowerCase().startsWith('bearer'))  
        throw new Error('Invalid authorization header') 

    const token = authToken.split(' ')[1]

    if(token !== '1234')
        throw new Error('Invalid authorization token')

    //Else request succeed
}