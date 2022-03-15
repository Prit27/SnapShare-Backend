const express = require('express');
const router = express.Router();
const fileController = require('../controller/files.controller');
router.post('/api/files',fileController.createNewFileForUser);
router.put('/api/files',fileController.addMembers);
router.get('/api/files',fileController.getFilesForUser);
router.delete('/api/files',fileController.removeMembers);
module.exports=router;