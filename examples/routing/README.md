<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [定义](#定义)
- [路由方法](#路由方法)
- [路由路径](#路由路径)
- [路由参数](#路由参数)
- [路由处理函数 Route handlers](#路由处理函数-route-handlers)
- [app.route()](#approute)
- [express.Router](#expressrouter)
- [如何处理 404 响应](#如何处理-404-响应)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## 定义
路由用于确定应用程序如何响应对特定端点的客户机请求，包含一个 URI（或路径）和一个特定的 HTTP 请求方法（GET、POST 等）。

每个路由可以具有一个或多个处理程序函数，这些函数在路由匹配时执行。

路由定义采用以下结构：
```javascript
// http://host:[port]/[path]

app.METHOD(PATH, HANDLER)
```
其中:
- `app` 是 express 的实例
- `METHOD ` 是 HTTP 请求方式
- `PATH` 是服务器的路径
- `HANDLER` 是路径匹配之后执行的函数

e.g:
```javascript
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})
/*  这个回调函数就是中间件 */
// function (req, res) {
//   res.send('Hello World!')
// }
```
## 路由方法
路由方法派生自 HTTP 方法之一，附加到 express 类的实例。
Express 支持对应于 HTTP 方法的以下路由方法：get、post、put、head、delete、options、trace、copy、lock、mkcol、move、purge、propfind、proppatch、unlock、report、mkactivity、checkout、merge、m-search、notify、subscribe、unsubscribe、patch、search 和 connect。
```javascript
app.post('/', function (req, res) {
  res.send('Got a POST request')
})

app.put('/user', function (req, res) {
  res.send('Got a PUT request at /user')
})

app.delete('/user', function (req, res) {
  res.send('Got a DELETE request at /user')
})

```

**app.all()** 是一种特殊的路由方法，并非派生自 HTTP 方法，用于在所有请求方法的路径中装入中间函数。
```javascript
app.all('/secret', (req, res, next) =>{
  console.log('Accessing the secret section ...');
  next()
})
```
## 路由路径
路由路径和请求方法结合，定义了请求的终点。**路由路径可以是字符串、字符串模式或者正则表达式。**

字符串的例子：
```javascript
app.get('/', function (req, res) {
  res.send('root')
})

app.get('/about', function (req, res) {
  res.send('about')
})

app.get('/random.text', function (req, res) {
  res.send('random.text')
})
```
基于字符模式串的路径例子：
```javascript
// 匹配 acd 和 abcd
app.get('/ab?cd', function (req, res) {
  res.send('ab?cd')
})
// 匹配 abcd, abbcd, abbbcd 等等
app.get('/ab+cd', function (req, res) {
  res.send('ab+cd')
})
// 匹配 abcd, abxcd, abRANDOMcd, ab123cd 等等
app.get('/ab*cd', function (req, res) {
  res.send('ab*cd')
})
// 匹配 /abe 和 /abcde
app.get('/ab(cd)?e', function (req, res) {
  res.send('ab(cd)?e')
})
```
基于正则表达式的路径例子：
```javascript
// 匹配包含 "a" 的路径
app.get(/a/, function (req, res) {
  res.send('/a/')
})
// 匹配以fly结尾的路径，例如 butterfly，dragonfly等
app.get(/.*fly$/, function (req, res) {
  res.send('/.*fly$/')
})

```
## 路由参数
路由参数是命名的URL段，用于捕获在URL中其位置指定的值。被捕获的值被填充到 `req.params` 对象中，使用路径中指定的route参数的名称作为它们各自的键。
> Route path: /users/:userId/books/:bookId
> 
> Request URL: http://localhost:3000/users/34/books/8989
> 
> req.params: { "userId": "34", "bookId": "8989" }

简单定义：
```javascript
app.get('/users/:userId/books/:bookId', function (req, res) {
  res.send(req.params)
})
```
连字符（-）和点（.）按字面意思解释
> Route path: /flights/:from-:to
> 
> Request URL: http://localhost:3000/flights/LAX-SFO
>
> req.params: { "from": "LAX", "to": "SFO" }

> Route path: /plantae/:genus.:species
> 
> Request URL: http://localhost:3000/plantae/Prunus.persica
> 
> req.params: { "genus": "Prunus", "species": "persica" }

为了更好地控制路由参数匹配的字符串，可以在圆括号中附加正则表达式()

> Route path: /user/:userId(\d+)
> 
> Request URL: http://localhost:3000/user/42
> 
> req.params: {"userId": "42"}

## 路由处理函数 Route handlers
可以提供多个回调函数来处理请求，这些函数的行为**类似于中间件**。**唯一的例外是，这些回调可能调用next('route')来绕过其余的路由回调。**
可以使用此机制对路由施加前置条件，然后在没有理由继续使用当前路由时将控制权传递给后续路由。

只有一个处理函数：
```javascript
app.get('/example/a', function (req, res) {
  res.send('Hello from A!')
})
```
多个处理函数：
```javascript
app.get('/example/b', function (req, res, next) {
  console.log('the response will be sent by the next function ...')
  next(); // 控制权传递给下一个处理函数
}, function (req, res) {
  res.send('Hello from B!')
})
```
处理函数数组：
```javascript
var cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

var cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

var cb2 = function (req, res) {
  res.send('Hello from C!')
}

app.get('/example/c', [cb0, cb1, cb2])
```
独立的函数和函数数组结合：
```javascript
var cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

var cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

app.get('/example/d', [cb0, cb1], function (req, res, next) {
  console.log('the response will be sent by the next function ...')
  next()
}, function (req, res) {
  res.send('Hello from D!')
})
```

## app.route()
可以通过 app.route 创造一个链式的路由处理函数。
```javascript
app.route('/book')
  .get(function (req, res) {
    res.send('Get a random book')
  })
  .post(function (req, res) {
    res.send('Add a book')
  })
  .put(function (req, res) {
    res.send('Update the book')
  })
```
## express.Router
通过 express.Router 类来创造一个模块化、可加载的路由处理器。

**一个 `Router` 实例是一个完整的中间件和路由系统。**

创造一个 router 文件，命名为 `expressRouter.js`：
```javascript
var express = require('express')
var router = express.Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/', function (req, res) {
  res.send('Birds home page')
})
// define the about route
router.get('/about', function (req, res) {
  res.send('About birds')
})

module.exports = router
```
然后在 `index.js` 文件中加载它：
```javascript
const birds = require('./expressRouter.js');
//...
app.use('/birds', birds)
```

## 如何处理 404 响应
在 Express 中，404 响应并不认为是错误的结果，因此错误处理器不会捕获它。404 只是意味着，Express 执行了所有的中间件函数和路由，都发现没有响应。所以应该在所有函数的下面去处理  404 响应。
```javascript
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})
```