import {  APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import {createLogger} from '../../utils/logger'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import {DBPostsService} from '../../services/dataAccess/DBPostsService' 
import {ApiResponseHelper} from '../../helpers/ApiResponseHelper'
import {AuthHelper} from '../../helpers/AuthHelper'


const dbPostsService = new DBPostsService();
const apiResponseHelper = new ApiResponseHelper();
const authHelper = new AuthHelper();

const logger = createLogger('AddPostHandler')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {  
  
  logger.info('Processing event: ', event)

  const parsedBody  = JSON.parse(event.body);

  const authHeader = event.headers['Authorization']
  const userId = authHelper.getUserIdFromAathrizationHeader(authHeader)

  logger.log('Logged in user',userId)

   const result = await dbPostsService.addPost(parsedBody,userId);

   return apiResponseHelper.generateDataSuccessResponse(201,"newPost",result);
})

handler.use(
  cors({
    credentials: true
  })
)
