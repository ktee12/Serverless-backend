// import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
const AWS = require('aws-sdk')
const AWSXRay = require('aws-xray-sdk')
//import { createLogger } from '../utils/logger'
import 'source-map-support/register'


const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
//const logger = createLogger('AttachmentsAccess')

export class AttachmentUtils {

    constructor(
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ) { }

    async getAttachmentUrl(attachmentId: string): Promise<string> {
        return `https://${this.bucketName}.s3.amazonaws.com/${attachmentId}`
    }

    async getUploadUrl(attachmentId: string): Promise<string> {
        const uploadUrl = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: attachmentId,
            Expires: parseInt(this.urlExpiration)
        })

        return uploadUrl
    }

}

// export class AttachmentUtils{
//     constructor(
//         private readonly s3 = new XAWS.S3({ signatureVersion: 'v4'}),
//         private readonly attachmentsBucket = process.env.ATTACHMENTS_S3_BUCKET || '',
//         private readonly uploadUrlExpiration = parseInt(
//             process.env.ATTACHMENT_UPLOAD_URL_EXPIRATION || '0'
//         ),
//         private readonly downloadUrlExpiration = parseInt(
//             process.env.ATTACHMENT_UPLOAD_URL_EXPIRATION || '0'
//         )
//     ){}

//     async fileExists(todoId: string): Promise<boolean>{
//         try{
//             logger.info('Checking if file already exists', {
//                 Bucket: this.attachmentsBucket,
//                 key: todoId
//             })
//             const head = await this.s3 
//                 .headObject({
//                     Bucket: this.attachmentsBucket,
//                     Key: todoId
//                 })
//                 .promise()
//                 logger.info('Head object result', { head })
//                 return true 
//         }catch (error){
//             logger.error('Head object error', {error})
//             return false
//         }
        
//     }

//     getUploadUrl(todoId: string){
//         return this.s3.getSignedUrl('putObject', {
//             Bucket: this.attachmentsBucket,
//             Key: todoId,
//             Expires: this.uploadUrlExpiration
//         })
//     }

//     getDownloadUrl(todoId: string){
//         return this.s3.getSignedUrl('getObject', {
//             Bucket: this.attachmentsBucket,
//             Key: todoId,
//             Expires: this.downloadUrlExpiration
//         })
//     }
// }