import { decode } from 'jsonwebtoken'
import { JwtToken } from '../auth/JwtToken'

export function getUserIdFromToken(authToken: string){

    const split = authToken.split(' ');
    const bearerToken = split[1];

    var token = decode(bearerToken) as JwtToken;
    token.sub;
}