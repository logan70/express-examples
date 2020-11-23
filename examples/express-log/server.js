const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const rfs = require("rotating-file-stream");
const uuid = require("uuid");

const app = express();
const port = 3000;
// token
morgan.token("id", function getId(req) {
  return req.id;
});

app.use((req, res, next) => {
  req.id = uuid.v4();
  next();
});

app.use(morgan(":id :method :url :response-time"));

// 写日志到单个文件
const accessLogStreamSingle = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

// 日志文件轮换
const accessLogStreamRotating = rfs.createStream("access.log", {
  interval: "1d", // 每天轮换
  path: path.join(__dirname, "log"),
});

// 错误响应 输出到控制台
// app.use(
//   morgan("dev", {
//     skip: function (req, res) {
//       return res.statusCode < 400;
//     },
//   })
// );

// app.use(morgan("combined", { stream: accessLogStreamRotating })); // dev, combined, common, short, tiny

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
