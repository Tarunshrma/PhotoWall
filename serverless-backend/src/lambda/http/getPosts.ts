import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import {DBPostsService} from '../../services/dataAccess/DBPostsService' 
import {ApiResponseHelper} from '../../helpers/ApiResponseHelper'

import {AuthHelper} from '../../helpers/AuthHelper'
import {createLogger} from '../../utils/logger'


const logger = createLogger('GetPostHandler')


const dbPostsService = new DBPostsService();
const apiResponseHelper = new ApiResponseHelper();
const authHelper = new AuthHelper();


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event: ', event)

  const authHeader = event.headers['Authorization']
  const userId = authHelper.getUserIdFromAathrizationHeader(authHeader)

  logger.info('Get all posts for user',userId)

   const posts = await dbPostsService.getAllPosts(userId);
   return apiResponseHelper.generateDataSuccessResponse(200,'posts',posts); 

})

handler.use(
  cors({
    credentials: true
  })
)
