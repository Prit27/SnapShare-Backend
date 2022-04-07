const dotenv = require('dotenv');
dotenv.config({path:'../../.env'});
const constants = require('../../constants/constants')
const dbClient = require( "@aws-sdk/client-dynamodb");
const createTableCommand = dbClient.CreateTableCommand;
const dynamoDbClient = dbClient.DynamoDBClient;
console.log(process.env.AWS_ACCESS_KEY_ID);
// Set the AWS Region.
const REGION = "us-east-1"; //e.g. "us-east-1"
// Create an Amazon DynamoDB service client object.
const ddbClient = new dynamoDbClient({ region: REGION });
module.exports = ddbClient;
