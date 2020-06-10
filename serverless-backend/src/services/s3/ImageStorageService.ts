import * as AWS  from 'aws-sdk'
import Jimp from 'jimp/es'
const AWSXRay = require('aws-xray-sdk')
import {createLogger} from '../../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

const postImageBucketName = process.env.POST_IMAGES_S3_BUCKET
const postThumbnailImageBucketName = process.env.POST_IMAGES_THUMBNAILS_S3_BUCKET
const urlExpiration = 300//process.env.SIGNED_URL_EXPIRATION

export class ImageStorageService{
    constructor(        
        private readonly logger = createLogger('ImageStorageService')
    )
    {}

    // deleteAttachmentImage(todoId: string){
    //     s3.deleteObject({
    //       Bucket: bucketName,
    //       Key: todoId
    //     })
    // }

    async getPostImageUploadUrl(imageId: string): Promise<string>{

        const uploadUrl = s3.getSignedUrl('putObject', {
            Bucket: postImageBucketName,
            Key: imageId,
            Expires: urlExpiration
          })

          return uploadUrl
    }

    async resizeAndUploadImage(imageKey: string){

        const response = await s3.getObject({
            Bucket: postImageBucketName,
            Key: imageKey
        },(error,data)=>{
            if(error){
                console.log(error.message)
            }else{
                console.log("Error fetching image: ",data)
            }
        }).promise()
        
        const body = response.Body
        const image = await Jimp.read(body)
        
        this.logger.info("Resizing image")
        image.resize(150, Jimp.AUTO)
        const convertedBuffer = await image.getBufferAsync(Jimp.AUTO)
        
        this.logger.log("Writing image back to S3 bucket:", postThumbnailImageBucketName)

        await s3.putObject({
            Bucket: postThumbnailImageBucketName,
            Key: `${imageKey}.jpeg`,
            Body: convertedBuffer
        },(error,data)=>{
            if(error){
                console.log(error.message)
            }else{
                console.log("Succesfully put resized image: ",data)
            }
        }).promise()
    }

    getImageBucketName():string{
        return postImageBucketName
    }

}