import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import {DBPostsService} from '../../dataAccess/DBPostsService' 
import {ApiResponseHelper} from '../../helpers/ApiResponseHelper'

const dbPostsService = new DBPostsService();
const apiResponseHelper = new ApiResponseHelper();

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log('Processing event: ', event)

   const posts = await dbPostsService.getAllPosts();
   return apiResponseHelper.generateDataSuccessResponse(200,'posts',posts); 

})

handler.use(
  cors({
    credentials: true
  })
)
