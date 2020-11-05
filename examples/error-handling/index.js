const express = require("express");
const app = express();
const port = 3000;

const fs = require("fs");

app.get("/", function (req, res, next) {
  fs.readFile("/file-does-not-exist", function (err, data) {
    if (err) {
      next(err); // Pass errors to Express.
    } else {
      res.send(data);
    }
  });
});

app.get("/broken", function (req, res, next) {
  setTimeout(function () {
    try {
      throw new Error("BROKEN");
    } catch (err) {
      next(err);
    }
  }, 100);
});

// 统一的错误处理程序，如果没有这个函数，就由系统默认的错误处理程序进行处理
app.use(function (err, req, res, next) {
  // console.error(err.stack);
  res.status(500).send("Something Error!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
