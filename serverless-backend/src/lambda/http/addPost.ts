import {  APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import {DBPostsService} from '../../services/dataAccess/DBPostsService' 
import {ApiResponseHelper} from '../../helpers/ApiResponseHelper'

const dbPostsService = new DBPostsService();
const apiResponseHelper = new ApiResponseHelper();

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {  
  
  console.log('Processing event: ', event)

  const parsedBody  = JSON.parse(event.body);

  const authToken = event.headers.Authorization;
  const userId = "";//getUserIdFromToken(authToken);

   const result = await dbPostsService.addPost(parsedBody,userId);

   return apiResponseHelper.generateCustomObjectDataSuccessResponse(201,result);
})

handler.use(
  cors({
    credentials: true
  })
)
