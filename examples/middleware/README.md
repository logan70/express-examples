<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [定义](#定义)
  - [五种中间件](#五种中间件)
  - [挂载中间件的方式](#挂载中间件的方式)
- [应用层中间件](#应用层中间件)
- [路由器层中间件](#路由器层中间件)
- [错误处理中间件](#错误处理中间件)
- [内置中间件](#内置中间件)
- [第三方中间件](#第三方中间件)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## 定义
Express 是一个路由和中间件 Web 框架，其自身只具有最低程度的功能：Express 应用程序基本上是一系列中间件函数调用。
中间件是一个在服务器收到请求和发送响应之前所执行的一些函数，它可以访问请求对象，响应对象，和 web 应用中处于请求-响应循环流程中的中间件。下一个中间件函数一般被命名为 next 。

中间件函数可以执行以下任务：
- 执行任何代码
- 修改请求和响应对象
- 终结请求-响应循环
- 调用堆栈中的下一个中间件
 
 如果当前中间件没有终结请求-响应循环，则必须调用 next() 方法将控制权交给下一个中间件，否则请求就会挂起。

**中间件装入顺序很重要：首先装入的中间件函数也首先被执行。**

### 五种中间件
- 应用层中间件
- 路由器层中间件
- 错误处理中间件
- 内置中间件
- 第三方中间件

### 挂载中间件的方式
- app.use
- app.HTTP_METHOD
- app.all
- app.param
- router.all
- router.use
- router.param
- router.HTTP_METHOD


## 应用层中间件

```javascript
// e.g 1 该例子显示没有安装路径的中间件函数。应用程序每次收到请求时执行该函数。
app.use(function(req,res,next){
    console.log('Time:', Date.now());
    next();
})
``
// e.g 2 该例子显示安装在 /user/:id 路径中的中间件函数。在 /user/:id 路径中为任何类型的 HTTP 请求执行此函数。
app.use('/user/:id', function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});

// e.g 3 该例子显示一个路由及其处理程序函数（中间件系统）。此函数处理针对 /user/:id 路径的 GET 请求。
app.get('/user/:id', function (req, res, next) {
  res.send('USER');
});

// e.g 4以下是在安装点使用安装路径装入一系列中间件函数的示例。 它演示一个中间件子堆栈，用于显示针对 /user/:id 路径的任何类型 HTTP 请求的信息。
app.use('/user/:id', function(req, res, next) {
  console.log('Request URL:', req.originalUrl);
  next();
}, function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});

// e.g 5
app.get('/user/:id', function (req, res, next) {
  console.log('ID:', req.params.id);
  next();
}, function (req, res, next) {
  res.send('User Info');
});

// 这个路由永远不会被调用，因为上一个路由已经结束了 请求/响应 循环。
app.get('/user/:id', function (req, res, next) {
  res.end(req.params.id);
});
```
可以为一个路径定义多个路由，但是如果第一个路由已经结束了 请求/响应 循环的话，第二个路由永远不会被调用，如 `e.g 5`。
要跳过路由器中间件堆栈中剩余的中间件函数，请调用 `next('route')` 将控制权传递给下一个路由。 

**注：**`next('route')` 仅在使用 `app.METHOD()` 或 `router.METHOD()` 函数装入的中间件函数中有效。

```javascript
app.get('/user/:id', function (req, res, next) {
  // 如果 userid 是0，跳到下一个路由
  if (req.params.id == 0) next('route');
  // 否则将控制权交给下一个中间件
  else next(); //
}, function (req, res, next) {
  // 渲染 regular 页面
  res.render('regular');
});

// handler for the /user/:id path, which renders a special page
app.get('/user/:id', function (req, res, next) {
  // 渲染 special 页面
  res.render('special');
});
```
## 路由器层中间件
路由器层中间件的工作方式与应用层中间件基本相同，差异之处在于它绑定到 `express.Router()` 的实例。使用 `router.use()` 和 `router.METHOD` 函数装入路由器层中间件。
```javascript
import express from 'express';
const router = express.Router();

router.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

router.get('/user/:id', function (req, res, next) {
  console.log(req.params.id);
  res.send('special');
});
```

## 错误处理中间件
错误处理中间件函数的定义方式与其他中间件函数基本相同，差别在于错误处理函数有四个自变量而不是三个，专门具有特征符 `(err, req, res, next)`：
```javascript
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

## 内置中间件
> express.static(root, [options])
 
Express 中唯一内置的中间件函数是 express.static。此函数基于 `serve-static`，负责提供 Express 应用程序的静态资源。root 自变量指定从其中提供静态资源的根目录。
```javascript
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now());
  }
}

app.use(express.static('public', options));
```
## 第三方中间件
以下示例演示如何安装和装入 cookie 解析中间件函数 cookie-parser。
```bash
npm install cookie-parser
```
```javascript
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');

// load the cookie-parsing middleware
app.use(cookieParser());
```













