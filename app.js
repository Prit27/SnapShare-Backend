const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const userRouter = require("./src/routes/user.routes");
const fileRouter = require("./src/routes/file.routes");

const requireAuthentication = require("./src/util/auth/authenticator");
const { PORT } = require("./src/util/constants/constants");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.all("/api/*", requireAuthentication.authenticator);
app.use(userRouter);
app.use(fileRouter);

app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Server started at port " + PORT });
});

module.exports = app;
