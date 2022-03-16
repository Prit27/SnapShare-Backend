const express = require('express')
const userRouter = require('./src/routes/user.routes')
const fileRouter = require('./src/routes/file.routes')

const requireAuthentication = require('./src/util/auth/authenticator')
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.all("/api/*",requireAuthentication.authenticator);
app.use(userRouter);
app.use(fileRouter);
module.exports = app;