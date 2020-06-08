import * as AWS  from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import {createLogger} from '../utils/logger'
import {Post} from '../models/Post'


const XAWS = AWSXRay.captureAWS(AWS)

export class DBPostsService{
    
    constructor(        
        private readonly docClient: AWS.DynamoDB.DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly postsTable = process.env.POSTS_TABLE,
        private readonly logger = createLogger('DBPostsService')
    )
    {}

    async getAllPosts(): Promise<Post[]>{

        this.logger.info("Fetching all posts:");

        //TODO: Replace it with query as scan is lesss performant
        const result = await this.docClient.scan({
            TableName: this.postsTable
        }).promise()

        const posts = result.Items as Post[];
        return posts; 
    
    }
}


 
