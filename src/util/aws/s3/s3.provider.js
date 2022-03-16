const dotenv = require('dotenv');
dotenv.config({path:'../../../../.env'});
const express = require('express');
const app = express();
const { ListBucketsCommand, CreateBucketCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
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

// Listing Buckets
const buckets = async() => {
  try {
    const data = await s3Client.send(new ListBucketsCommand({}));
    console.log(data.buckets);
  } catch (error) {
    console.log(error);
  }
}
//buckets();

// Getting element from a bucket
// regex ^(\/(.*)\/(.*)\/(.+))$
// Follow https://stackoverflow.com/questions/66120548/aws-s3-sdk-v3-for-node-js-getobjectcommand-v-s-getsignedurl


app.get("/test",async (req,res)=>{
  console.log("IN API")
  try {
    const bucketGetParameters = {
      Bucket:"somerealrandombucketthatyoucannotthinkof",
      Key:"image.png"
    }
    const someStream = new GetObjectCommand(bucketGetParameters);
    const signedUrl = await getSignedUrl(s3Client,someStream,{expiresIn:3600});
    console.log(someStream);
    //   res.attachment("one.txt");
   // someStream.pipe(res);
   res.json(signedUrl);
  } catch (error) {
    console.log(error)
  }
});
app.listen(3000);
const getItemFromBucket = async(req,res) => {
  
}
