module.exports = Object.freeze({
  PORT: 8080,
  AUTHORIZATION_HEADER: 'authorization',
  BUCKET_NAME:'demo-snapshare-s3-bucket',
  FILE_TABLE_NAME:'FilesDB',
  ADD_MEMBER_UPDATE_EXPRESSION:"ADD sharedWith :sharedWith",
  DELETE_MEMBER_UPDATE_EXPRESSION:"DELETE sharedWith :sharedWith",
  MEMBER_UPDATE_VALUE:":sharedWith",
  REGION:'us-east-1'
});