const url = require('url');

const getFilePathFromUrl = (s3UrlString)=>{
  const s3Url = new url(s3UrlString);
  return s3Url.pathname;
}
exports.getFilePathFromUrl=getFilePathFromUrl;