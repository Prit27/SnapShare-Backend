const mongoose = require('mongoose');
const { DynamoDBClient, BatchExecuteStatementCommand } = require("@aws-sdk/client-dynamodb");
const model = mongoose.model;
const Schema = mongoose.Schema;

const user = new Schema({
  id:String,
  username:String,
  createdDate:Date
})


module.exports = model("User",user);