const url = require('url');

const getFilePathFromUrl = (s3UrlString)=>{
  const s3Url =  url.parse(s3UrlString);
  return s3Url.pathname;
}
exports.getFilePathFromUrl=getFilePathFromUrl;