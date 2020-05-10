import { DynamoDBStreamHandler, DynamoDBStreamEvent } from 'aws-lambda'
import 'source-map-support/register'


export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {

    for(const record of event.Records){
        console.log('Processing Records: ',JSON.stringify(record))
    }
}