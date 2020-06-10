import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import {createLogger} from '../../utils/logger'
import {DBWSConnectionService} from '../../services/dataAccess/DBWSConnectionService' 
import {ApiResponseHelper} from '../../helpers/ApiResponseHelper'

const dbWSConnectionService = new DBWSConnectionService();
const apiResponseHelper = new ApiResponseHelper();
const logger = createLogger('sendNotifications')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Websocket connect')

    const connectionId = event.requestContext.connectionId
    await dbWSConnectionService.addConnection(connectionId)

    return apiResponseHelper.generateEmptySuccessResponse(200);
  }