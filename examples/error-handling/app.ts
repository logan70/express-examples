import express from 'express';
import fs from 'fs';
import {NextFunction, Request, Response} from 'express';
import {systemConfig} from './config';
const app = express();

app.get("/", function (req:Request, res:Response, next:NextFunction) {
  fs.readFile("/file-does-not-exist", function (err, data) {
    if (err) {
      next(err); // Pass errors to Express.
    } else {
      res.send(data);
    }
  });
});

app.get("/broken", function (req:Request, res:Response, next:NextFunction) {
  setTimeout(function () {
    try {
      throw new Error("BROKEN");
    } catch (err) {
      next(err);
    }
  }, 100);
});

// 统一的错误处理程序，如果没有这个函数，就由系统默认的错误处理程序进行处理
app.use(function (err:Error, req:Request, res:Response, next:NextFunction) {
  // console.error(err.stack);
  res.status(500).send("Something Error!");
});

app.listen(systemConfig.port, () => {
  console.log(`Example app listening at http://localhost:${systemConfig.port}`);
});
