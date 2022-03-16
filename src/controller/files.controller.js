const File = require("../model/File");
const auth = require("../util/auth/authenticator");
const dynamoDbClient = require("@aws-sdk/client-dynamodb");
const client = require("../util/aws/dynamo/dynamo.provider");
const s3Client = require("../util/aws/s3/s3.provider");
const urlUtil = require("../util/url/url");
const uuid = require('uuid');
const {
  FILE_TABLE_NAME,
  MEMBER_UPDATE_VALUE,
  ADD_MEMBER_UPDATE_EXPRESSION,
  DELETE_MEMBER_UPDATE_EXPRESSION,
} = require("../util/constants/constants");

const createNewFileForUser = async (req, res) => {
  const user = auth.getAuthenticatedUser();
  let fileRequest = new File(req.body);
  fileRequest.created = String(new Date());
  let password;
  if (req.body.passwordEnabled === true) {
    password = req.body.password;
  } else {
    password = "";
  }
  const file = {
    TableName: FILE_TABLE_NAME,
    Item: {
      id: { S: String(uuid.v4()) },
      created: { S: String(fileRequest.created) },
      path: { S: fileRequest.path },
      createdBy: { S: user.Email },
      password: { S: password },
      passwordEnabled: { S: String(req.body.passwordEnabled) },
      enabled: { S: "true" },
    },
  };
  try {
    const resp = await client.send(new dynamoDbClient.PutItemCommand(file));
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
  }
};
const addMembers = async (req, res) => {
  const user = auth.getAuthenticatedUser();
  console.log(user.Email);
  const usersToBeAdded = req.body.users;
  const fileId = req.body.fileId;
  console.log(usersToBeAdded);
  console.log(fileId);
  const params = {
    TableName: FILE_TABLE_NAME,
    Key: {
      id: { S: user.Email },
    },
    UpdateExpression: ADD_MEMBER_UPDATE_EXPRESSION,
    ExpressionAttributeValues: {
      MEMBER_UPDATE_VALUE: { SS: usersToBeAdded },
    },
    ReturnValues: "UPDATED_NEW",
  };
  try {
    const resp = await client.send(
      new dynamoDbClient.UpdateItemCommand(params)
    );
    console.log(resp);
    res.status(200).json({ success: true, data: resp });
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

const removeMembers = async (req, res) => {
  const user = auth.getAuthenticatedUser();
  console.log(user.Email);
  const usersToBeAdded = req.body.users;
  const fileId = req.body.fileId;
  console.log(usersToBeAdded);
  console.log(fileId);
  const params = {
    TableName: FILE_TABLE_NAME,
    Key: {
      id: { S: user.Email },
    },
    UpdateExpression: DELETE_MEMBER_UPDATE_EXPRESSION,
    ExpressionAttributeValues: {
      MEMBER_UPDATE_VALUE: { SS: usersToBeAdded },
    },
    ReturnValues: "ALL_NEW",
  };
  try {
    const resp = await client.send(
      new dynamoDbClient.UpdateItemCommand(params)
    );
    console.log(resp);
    res.status(200).json({ success: true, data: resp });
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

const getFilesForUser = async (req, res) => {
  const user = auth.getAuthenticatedUser();
  const params = {
    TableName: FILE_TABLE_NAME,
    FilterExpression: "#createdBy = :createdBy",
    ExpressionAttributeNames: {
      "#createdBy": "createdBy",
    },
    ExpressionAttributeValues: {
      ":createdBy": { S: user.Email },
    },
  };
  try {
    const data = await client.send(new dynamoDbClient.ScanCommand(params));
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const test = async (req, res) => {
  try {
    const data = await getFileById(req.query.fileId);
    res.status(200).json({ data: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFileById = async (fileId) => {
  const user = auth.getAuthenticatedUser();
  const params = {
    TableName: FILE_TABLE_NAME,
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": { S: fileId },
    },
  };
  try {
    const data = await client.send(new dynamoDbClient.QueryCommand(params));
    console.log(data);
    return data.Items[0];
  } catch (error) {
    return error.message;
  }
};

/*  GET Shared Files for User 
  REFER https://stackoverflow.com/questions/44990872/dynamodb-query-by-contains-one-of-the-values-from-array-for-node-js
*/

/*
 POST file api
 accepts file path and a password to access
 returns the downloaded file OR stream directly for download
*/
const getFile = async (req, res) => {
  const fileId = req.body.fileId;
  const password = req.body.password;
  const file = getFileById(fileId);
  if (file.passwordEnabled.S === "true") {
    const filePassword = file.password.S;
    if (password === filePassword) {
    }
    res
      .status(401)
      .json({ success: false, message: "Password Incorrect: Unauthorized" });
  } else {
    // return
  }
};

const getSignedUrlFromS3 = async (fileUrl) => {
  try {
    const filePath = urlUtil.getFilePathFromUrl(fileUrl);
    const diffIndex = path.substring(1, filePath.length).indexOf("/");
    const bucketName = path.substring(0, filePath + 1);
    const fileName = path.substring(filePath + 1, filePath.length);
    const bucketGetParameters = {
      Bucket: bucketName,
      Key: fileName,
    };
    const readableFileStream = new GetObjectCommand(bucketGetParameters);
    const signedUrl = await getSignedUrl(s3Client, readableFileStream, {
      expiresIn: 3600,
    });
    console.log(someStream);
    //   res.attachment("one.txt");
    // someStream.pipe(res);
    res.json(signedUrl);
  } catch (error) {
    console.log(error);
  }
};

exports.createNewFileForUser = createNewFileForUser;
exports.addMembers = addMembers;
exports.getFilesForUser = getFilesForUser;
exports.removeMembers = removeMembers;
exports.test = test;
// creating a dynamodb PUT object
