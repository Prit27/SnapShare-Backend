const dotenv = require('dotenv');
dotenv.config({path:'../../../../.env'});

const { ListBucketsCommand } = require('@aws-sdk/client-s3');
const s3 = require('@aws-sdk/client-s3');
const constants = require('..//../constants/constants');
const client = s3.S3Client;
const s3Client = new client({region:constants.REGION});
console.log(s3Client);
module.exports = s3Client;

// Creating a bucket


// Listing Buckets
const buckets = async() => {
  try {
    const data = await s3Client.send(new ListBucketsCommand({}));
    console.log(data.buckets);
  } catch (error) {
    console.log(error);
  }
}
buckets();
