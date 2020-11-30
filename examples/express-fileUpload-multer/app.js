const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const pathLib = require("path");

const app = express();

app.listen(8080);

// 引入Multer
const multer = require("multer");

// 设置保存上传文件路径
const upload = multer({
  dest: "./static/upload",
});

// 处理上传文件
app.use(upload.any());

// 处理表单提交，对应请求头application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: false, // 为true时将使用qs库处理数据，通常不需要
  })
);

// 处理fetch请求，对应请求头application/json
app.use(bodyParser.json());

// 接收文件上传结果
app.post("/upload", (req, res, next) => {
  console.log(req.files);
  //上传的文件在files里
  const newName =
    req.files[0].path + pathLib.parse(req.files[0].originalname).ext;
  fs.rename(req.files[0].path, newName, function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send("succeed");
    }
  });
});

app.get("/reg", (req, res, next) => {
  console.log(req.query);
  res.send({
    error: 0,
    data: req.query,
    msg: "注册成功",
  });
});

app.post("/login", (req, res, next) => {
  console.log(req.body);
  res.send({
    error: 0,
    data: req.body,
    msg: "登录成功",
  });
});

app.use(express.static("./static/"));

console.log(`app started at 8080`);
