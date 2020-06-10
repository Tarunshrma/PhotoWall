import * as AWS  from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import {createLogger} from '../../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

export class DBWSConnectionService{
    
    constructor(        
        private readonly docClient: AWS.DynamoDB.DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly connectionTable = process.env.CONNECTION_TABLE,
        private readonly logger = createLogger('DBWSConnectionService')
    )
    {}

    async getAllConnections() {

        const connections = await this.docClient.scan({
            TableName: this.connectionTable
        },(error,data)=>{
            if(error){
                this.logger.error(error.message)
            }else{
                this.logger.info("Succesfully fetched connections",data)
            }
        }).promise()
    
        return connections;
    }

    async deleteConnection(connectionId: string) {

        await this.docClient.delete({
            TableName: this.connectionTable,
            Key: {
              id: connectionId
            }
          },(error,data)=>{
            if(error){
                this.logger.error(error.message)
            }else{
                this.logger.info("Succesfully deleted connection",data)
            }
          }).promise()
    
    }

    async addConnection(connectionId: string) {

        const timestamp = new Date().toISOString()
  
        const item = {
          id: connectionId,
          timestamp
        }
      
        await this.docClient.put({
          TableName: this.connectionTable,
          Item: item
        },(error,data)=>{
            if(error){
                this.logger.error(error.message)
            }else{
                this.logger.info("Succesfully deleted connection",data)
            }
        }).promise()
    
    }
    
} 
