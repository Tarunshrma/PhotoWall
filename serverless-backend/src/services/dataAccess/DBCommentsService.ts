import * as AWS  from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import {createLogger} from '../../utils/logger'
import * as uuid from 'uuid'

const XAWS = AWSXRay.captureAWS(AWS)

export class DBCommentsService{
    
    constructor(        
        private readonly docClient: AWS.DynamoDB.DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly commentsTable = process.env.COMMENTS_TABLE,
        private readonly commentsTableIndex = process.env.COMMENTS_INDEX,
        private readonly logger = createLogger('DBCommentsService')
    )
    {}

    async getCommentsFromPostId(postId: string) {

        const params = {
            TableName: this.commentsTable,
            KeyConditionExpression: 'postId = :postId',
            ExpressionAttributeValues: {
              ':postId': postId
            }
          };
    
        const result = await this.docClient.query(params,(error,data)=>{
            if(error){
                this.logger.error(error.message)
            }else{
                this.logger.info("Comments fetched", data)
            } 
        }).promise();
    
        return result.Items;
    }

    async addComment(postId: string, comment: string): Promise<any>{

        const timeStamp = new Date().toISOString();
        const commentId = uuid.v4();
        
        const newComment = {
            postId: postId,
            timestamp: timeStamp,
            commentId: commentId,
            comment : comment  
        }
      
       await this.docClient.put({
          TableName: this.commentsTable,
          Item: newComment
        },(error,data)=>{
            if(error){
                this.logger.error(error.message)
            }else{
                this.logger.info("Comments Added", data)
            } 
        }).promise()
      
        return newComment;
    }

    async deleteAllCommentForPost(postId: string): Promise<void>{
        
        this.logger.info("Deleting comment from post id:",postId);

        const params = {
            TableName: this.commentsTable,
            Key:{
                "postId":postId
            }
        };
    
        await this.docClient.delete(params,(error,_data)=>{
            if(error){
                console.log(error.message)
            }else{
                console.log("Succesfully deleted post: ",postId)
            }
        }).promise();
    }

    async getCommentsFromId(commentId: string) {
        
        const params = {
            TableName: this.commentsTable,
            IndexName: this.commentsTableIndex,
            KeyConditionExpression: 'commentId = :commentId',
            ExpressionAttributeValues: {
              ':commentId': commentId
            }
          };
        
          const result = await this.docClient.query(params,(error,data)=>{
            if(error){
                this.logger.error(error.message)
            }else{
                this.logger.info("Comments fetched", data)
            } 
          }).promise();
        
          return result;
    }
} 
