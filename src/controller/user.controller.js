const auth = require('../util/auth/authenticator')
const User = require('../model/User');
const getUserDetails = (req,res) =>{
try {
  const currentUser = auth.getAuthenticatedUser();
  res.status(200).json(
    {success:true,data:currentUser} 
  )
} catch (error) {
  res.status(500).json({sucess:false,message:error.message});
}
}
exports.getUserDetails=getUserDetails;
