import * as AWS  from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import {createLogger} from '../utils/logger'


const XAWS = AWSXRay.captureAWS(AWS)

export class DBCommentsService{
    
    constructor(        
        private readonly docClient: AWS.DynamoDB.DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly commentsTable = process.env.COMMENTS_TABLE,
        private readonly commentsTableIndex = process.env.COMMENTS_INDEX,
        private readonly logger = createLogger('DBCommentsService')
    )
    {}
} 
