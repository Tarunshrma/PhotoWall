import {  APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import {ApiResponseHelper} from '../../helpers/ApiResponseHelper'
import { DBCommentsService } from '../../services/dataAccess/DBCommentsService';

const dbCommentsService = new DBCommentsService();
const apiResponseHelper = new ApiResponseHelper();


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log('Processing event: ', event)

  const commentId = event.pathParameters.commentId  
  const result = await dbCommentsService.getCommentsFromId(commentId);

  if(result.Count !== 0){
    return apiResponseHelper.generateCustomObjectDataSuccessResponse(200,result.Items[0])
  }  

  return apiResponseHelper.generateErrorResponse(404,'No comment with this id')
})

handler.use(
  cors({
    credentials: true
  })
)

