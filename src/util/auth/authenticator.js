const jwt = require('jwt-decode');
const constants = require('../constants/constants')
let currentUser;

const authenticator = async (req,res,next) =>{
  try {
   console.log(req);
   const bearerToken = req.header('authorization');
   if(String(bearerToken).trim() === "" || !(String(bearerToken).includes('Bearer'))) {
    res.status(401).json({success:false,message:"Unauthorized"});
   } 
   const token = String(bearerToken).split(' ')[1];
   const decodedToken = await jwt(token);
   currentUser = decodedToken;
   next();
  } catch (error) {
    res.status(500).json({success:false,message:error.message});
  }
}
const getAuthenticatedUser = () => {
  return currentUser;
}
exports.getAuthenticatedUser=getAuthenticatedUser;
exports.authenticator=authenticator;