import * as AWS  from 'aws-sdk'

const s3 = new AWS.S3({
    signatureVersion: 'v4'
})

const postImageBucketName = process.env.POST_IMAGES_S3_BUCKET
const postThumbnailImageBucketName = process.env.POST_IMAGES_THUMBNAILS_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export class ImageStorageService{

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

    getImageBucketName():string{
        return postImageBucketName
    }

}