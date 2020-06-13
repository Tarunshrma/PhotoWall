import { CustomAuthorizerHandler, CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify, decode } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'
import { Jwt } from '../../auth/Jwt'
import Axios from 'axios'

import {createLogger} from '../../utils/logger'

const logger = createLogger('AuthService')


const jwksUrl = 'https://dev-j8omys-t.auth0.com/pem'

export const handler: CustomAuthorizerHandler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {

    try{
        var token = await verifyToken(event.authorizationToken)
        logger.info('User is authorized')

        return {
            principalId: token.sub,
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
          logger.error('User was not authorized', e.message)
      
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

async function verifyToken(authHeader: string): Promise<JwtToken> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  if(!jwt){
    throw new Error('invalid token')
  }

  try {
    const response = await Axios.get(jwksUrl);
    var verifedToken = verify(token,response.data,{algorithms:['RS256']})

    return  verifedToken as JwtToken
  } catch (error) {
    logger.error(error);
    return undefined
  }
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
