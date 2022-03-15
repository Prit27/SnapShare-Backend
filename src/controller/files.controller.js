const File = require('../model/File');
const auth = require('../util/auth/authenticator');
const dynamoDbClient = require('@aws-sdk/client-dynamodb')
const client = require('../util/aws/dynamo/dynamo.provider');
const { param } = require('../routes/user.routes');

const createNewFileForUser = async (req,res) => {
  console.log('apigate')
  const user = auth.getAuthenticatedUser();
  let fileRequest =  new File(req.body);
  fileRequest.created = String(new Date());
  const file = {
    TableName:"Files",
    Item:{
      id:{S:user.Email},
      created:{S:String(fileRequest.created)},
      path:{S:fileRequest.path},
      createdBy:{S:user.Email},
      enabled:{S:"true"}
   }
    }
    try {
      const resp = await client.send(new dynamoDbClient.PutItemCommand(file));
      res.status(200).json({success:true});
    } catch (error) {
      console.log(error);      
    }  
}
const addMembers = async(req,res)=>{
  console.log('in API')
  const user = auth.getAuthenticatedUser();
  console.log(user.Email);
  const usersToBeAdded = req.body.users;
  const fileId = req.body.fileId;
  console.log(usersToBeAdded);
  console.log(fileId);
  const params = {
    TableName:"Files",
    Key:{
      id:{S:user.Email}
    },
    UpdateExpression: "ADD sharedWith :sharedWith",
    ExpressionAttributeValues: {
      ":sharedWith": {SS:usersToBeAdded}
    },
    ReturnValues:"UPDATED_NEW"
  }
  try {
    const resp = await client.send(new dynamoDbClient.UpdateItemCommand(params));
    console.log(resp);
    res.status(200).json({success:true,data:resp});      
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
}

const removeMembers = async(req,res)=>{
  console.log('in API')
  const user = auth.getAuthenticatedUser();
  console.log(user.Email);
  const usersToBeAdded = req.body.users;
  const fileId = req.body.fileId;
  console.log(usersToBeAdded);
  console.log(fileId);
  const params = {
    TableName:"Files",
    Key:{
      id:{S:user.Email}
    },
    UpdateExpression: "DELETE sharedWith :sharedWith",
    ExpressionAttributeValues: {
      ":sharedWith": {SS:usersToBeAdded}
    },
    ReturnValues:"ALL_NEW"
  }
  try {
    const resp = await client.send(new dynamoDbClient.UpdateItemCommand(params));
    console.log(resp);
    res.status(200).json({success:true,data:resp});      
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
}


const getFilesForUser = async(req,res) => {
  const user = auth.getAuthenticatedUser();
  const params = {
    TableName:"Files",
    FilterExpression:"#createdBy = :createdBy",
    ExpressionAttributeNames:{
      "#createdBy":"createdBy"
    },
    ExpressionAttributeValues:{
      ":createdBy":{S:user.Email}
    }
  };
  try {
    const data = await client.send(new dynamoDbClient.ScanCommand(params));
    res.status(200).json({success:true,data:data});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({success:false,message:error.message});
  }

}

/*  GET Shared Files for User 
  REFER https://stackoverflow.com/questions/44990872/dynamodb-query-by-contains-one-of-the-values-from-array-for-node-js
*/

/*
 POST file api
 accepts file path and a password to access
 returns the downloaded file OR stream directly for download
*/
const getFile = async(req,res)=>{
  const fileId = req.body.fileId;
  const password = req.body.password;
  // some call to method to get a particular file
  const filePath = "someS3Link";
  
}


exports.createNewFileForUser=createNewFileForUser;
exports.addMembers=addMembers;
exports.getFilesForUser=getFilesForUser;
exports.removeMembers=removeMembers;
  // creating a dynamodb PUT object


