module.exports = Object.freeze({
  PORT: 8080,
  AUTHORIZATION_HEADER: 'authorization',
  FILE_TABLE_NAME:'Files',
  ADD_MEMBER_UPDATE_EXPRESSION:"ADD sharedWith :sharedWith",
  DELETE_MEMBER_UPDATE_EXPRESSION:"DELETE sharedWith :sharedWith",
  MEMBER_UPDATE_VALUE:":sharedWith",
  REGION:'us-east-1'
});