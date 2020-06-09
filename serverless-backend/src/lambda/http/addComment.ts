import {  APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import {DBPostsService} from '../../services/dataAccess/DBPostsService' 
import {ApiResponseHelper} from '../../helpers/ApiResponseHelper'
import { DBCommentsService } from '../../services/dataAccess/DBCommentsService';

const dbPostsService = new DBPostsService();
const dbCommentsService = new DBCommentsService();
const apiResponseHelper = new ApiResponseHelper();


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  
  const postId = event.pathParameters.postId;

  const postExist = await dbPostsService.isPostExist(postId); 

  if(!postExist){
    apiResponseHelper.generateErrorResponse(404,"Post does not exist")
  }  


  const parsedBody  = JSON.parse(event.body);
  const newComment = await dbCommentsService.addComment(postId,parsedBody.comment)

  return apiResponseHelper.generateCustomObjectDataSuccessResponse(201,newComment)

})

handler.use(
  cors({
    credentials: true
  })
)
