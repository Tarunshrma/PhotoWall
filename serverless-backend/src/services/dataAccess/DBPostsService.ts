import * as AWS  from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import {createLogger} from '../../utils/logger'
import {Post} from '../../models/Post'
import * as uuid from 'uuid'
import {getUserIdFromToken} from '../../utils/utils'
import {ImageStorageService} from '../../services/s3/ImageStorageService' 
import { Bool } from 'aws-sdk/clients/clouddirectory'


const imageStorageService = new ImageStorageService();


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

    async deletePost(postId: string): Promise<void>{
        
        this.logger.info("Deleting post with id:",postId);

        const params = {
            TableName: this.postsTable,
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

    async addPost(post: any, userId: string): Promise<any>{

        const postId = uuid.v4();
        const imageId = uuid.v4();

        const uploadUrl = await imageStorageService.getPostImageUploadUrl(imageId)
     
        const newPost = {
            postId: postId,
            userId: userId,
            ImageUrl: `https://${imageStorageService.getImageBucketName()}.s3.amazonaws.com/${imageId}`,
            ...post
        }
      
        this.logger.info("Adding new post:",newPost);

        await this.docClient.put({
            TableName: this.postsTable,
            Item: newPost
          },(error,data)=>{
            if(error){
                this.logger.error(error.message)
            }else{
                this.logger.info("Succesfully Added new post",data)
            }
          }).promise()

          const postResponse = {
                                post:newPost,
                                uploadUrl:uploadUrl
                               } 
        
          return postResponse
    }

    async isPostExist(postId: string): Promise<Bool>
    {
        const params = {
            TableName : this.postsTable,
            Key: {
                postId: postId
            }
        };

        const result = await this.docClient.get(params,(error,_data)=>{
            if(error){
                this.logger.error(error.message)
            }else{
                this.logger.info("Post exist with id", postId)
            } 
        }).promise();

        return !!result.Item; 
    }
}




 
