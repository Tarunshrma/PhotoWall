import { S3Event, S3Handler } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'

export const handler: S3Handler = async (event: S3Event) => {
    
    for(const post of event.Records){
        const key = post.s3.object.key;
        console.log("Processing S3 item with the key :", key);
    }
    
  }