const dotenv = require('dotenv');
dotenv.config({path:'../../../../.env'});
const {  CreateBucketCommand} = require('@aws-sdk/client-s3');
const { getSignedUrl  } = require("@aws-sdk/s3-request-presigner");
const s3 = require('@aws-sdk/client-s3');
const constants = require('..//../constants/constants');
const res = require('express/lib/response');
const client = s3.S3Client;
const s3Client = new client({region:constants.REGION});
module.exports = s3Client;

// Creating a bucket
const createBucket = async()=>{
  try {
    const bucketParams = {
      Bucket:"somerealrandombucketthatyoucannotthinkof"
    };
    const response = await s3Client.send(new CreateBucketCommand(bucketParams));
    console.log(response);
  } catch (error) {
    console.log(error)
  }
}
//createBucket();
