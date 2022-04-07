// gearing the requirements
const dotenv = require('dotenv');
dotenv.config({path:'../../.env'})
const dynamo = require('@aws-sdk/client-dynamodb')
const client = dynamo.DynamoDBClient;
const createTable = dynamo.CreateTableCommand;
const REGION = "us-east-1";
const dynamoDbClient =  new client({ region: REGION });
// creating a model using mongoose
const mongoose = require('mongoose');
const model = mongoose.model;
const Schema = mongoose.Schema;
const file = new Schema({
  id:String,
  created:String,
  path:String,
  createdBy:String,
  fileName:String,
  fileType:String,
  fileSize:String,
  sharedWith:{
    type:Array,
    default:[]
  }
});

module.exports = model("File",file);

// creating the files table 
const createFileTable = async () =>{
  const params = {
    TableName: "Files",
    KeySchema:[
      {AttributeName:"id",KeyType:"HASH"},
    ],
    AttributeDefinitions:[
      {AttributeName:"id",AttributeType:"S"},
   /*   {AttributeName:"path",AttributeType:"S"},
      {AttributeName:"createdBy",AttributeType:"S"},
      {AttributeName:"sharedWith",AttributeType:"S"} */
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    StreamSpecification: {
      StreamEnabled: false,
    }  
  }
  try {
    const createdResponse = await dynamoDbClient.send(new createTable(params));
    console.log(createdResponse);
      
  } catch (error) {
    console.log(error)
  }
}



