const userController = require('../controller/user.controller')
const express = require('express')
const router = express.Router();

router.get("/api/user",userController.getUserDetails);
module.exports = router;
