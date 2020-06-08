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
    
    const postId = event.pathParameters.postId
    
    await dbPostsService.deletePost(postId); 
    return  apiResponseHelper.generateEmptySuccessResponse(200);

})

handler.use(
  cors({
    credentials: true
  })
)