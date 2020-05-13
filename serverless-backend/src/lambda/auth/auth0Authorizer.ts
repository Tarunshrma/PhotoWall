import { CustomAuthorizerHandler, CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const RS256_Certificate = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJNju3A8NGbdvAMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi1qOG9teXMtdC5hdXRoMC5jb20wHhcNMjAwNDI4MDM0MTA1WhcNMzQw
MTA1MDM0MTA1WjAhMR8wHQYDVQQDExZkZXYtajhvbXlzLXQuYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzbuB0twoXuXh2owF9mQUBavx
lmn8aETCRuwdbXUYRtwiGG1+eR3DmkFXoc883GtybF4mvcjfqS7g7biSanhFaEEB
BySgNKhipuGN9uTg5u65KJ2wMte1wKviifAShPU8+sb/HtHWj2vneq8ZvUdX30j7
N0VBjbiI7TexmQcJ8VpFLteViH89o+6wjJhHZEtpOEAd2rNGZ5l1/WFYtI3CUAvs
jA/Jdl61qL3prew2FraGe33BC/qpTzQpW4XncfD6sNEBqIVTHDDbhbU+JIsgPxQW
LfNK/lAWgpxpRD2nGNEmasT41BJhEKOChXlc6xsZPjTZEkHVI5G7vDKvB6MGowID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTtGMIohLG+MurBKxfH
MbTpCHVN0DAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAA8WcNUq
2riJO2pkOLZdhvMRyyTFlA2lH+hN+rDAuE51dBj55jGh78gstkL3Sn9Dr/SbUWzD
1ceFGxCPbTozU4PfAkgwm8qzCbmiISGJDE+pzckhCqHS2rFhh08sZ9Vx2MyZUMoC
GSkVNvEZxua4iyI0+TTknWwTfgQYApUDS4eEgbrBNxlEXikkK4cHYFYVEfzFAo1X
tpPY1RjiSLbmVQ1aH0QXwWUeeZxxfZwOq7aSTBI70eS8rmIUkYX6KJrziCv+PYWb
NM64FA9m/8x427g10HMDTl7LKi1BtF+rMLCDfDQhyVh3lKyF/F7MwYkDr+PBHn7e
1p/6uQQ351MiTR8=
-----END CERTIFICATE-----`

export const handler: CustomAuthorizerHandler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {

    try{
        var token = verifyToken(event.authorizationToken)
        console.log('User is authorized')

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

function verifyToken(authToken: String): JwtToken{
    if(!authToken)
        throw new Error('No authorization header')

    if(!authToken.toLowerCase().startsWith('bearer'))  
        throw new Error('Invalid authorization header') 

    const token = authToken.split(' ')[1]

    return verify(token, RS256_Certificate,{algorithms : ['RS256']}) as JwtToken
    //Else request succeed
}