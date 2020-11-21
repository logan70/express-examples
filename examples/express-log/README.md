# 安装
morgan 是 node.js 的 HTTP 请求日志中间件。

先安装：
```bash
npm install morgan --save 
```
```bash
const morgan = require('morgan')
```
# morgan(format, options)
通过 `format` 和 `options` 这两个参数创造一个新的 morgan 中间件。
## format
`format` 参数可以是预定义字符串，格式化字符串的字符串，或者是一个生产日志记录的函数，这个函数会有是三个参数`tokens`，`req`，`res`，返回字符串内容记录日志，或者 `undefined` / `null` 跳过日志。

### **预定义字符串**
```javascript
morgan('tiny')
```
### **格式化字符串的字符串**
```javascript
morgan(':method :url :status :res[content-length] - :response-time ms')
```
#### 预先定义好的格式：
**combined**

标准的 Apache 组合日志输出：
```
:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
```
**common**

标准的 Apache 普通日志输出：
```
:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]
```
**dev**

开发环境使用的简洁输出，按响应状态着色：
```
:method :url :status :response-time ms - :res[content-length]
```
**short**

比默认的短，但是也包含响应时间：
```
:remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms
```
**tiny**

最小的输出：
```
:method :url :status :res[content-length] - :response-time ms
```
### **自定义函数**
```javascript
morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
})
```
## Options
`Options` 参数可以是以下值：
**immediate**
在请求的时候记录日志，而不是响应的时候。这意味着即使服务器崩溃了，这个请求也会被记录，但是响应的数据(比如响应码，内容长度等)就不会被记录。
**skip**
决定是否跳过日志记录的函数，默认返回值为 `false`，默认有两个参数 `req` 和 `res`
```javascript
// 仅记录错误的响应日志
morgan('combined', {
  skip: function (req, res) { return res.statusCode < 400 }
})
```
**stream**
写日志的输出流，默认是 `process.stdout`。

## Tokens
### 创建新的 Takens
```javascript
morgan.token('type', function (req, res) { return req.headers['content-type'] })
```

# morgan.compile(format)
把一个格式化字符串编译成一个 `format` 函数供 `morgan` 使用。

# 例子
## express/connect
```javascript
const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('combined'))
app.get('/',(req,res) => {
  res.send('hello, world!')
})
```
## 普通的 http 服务
```javascript
const finalhandler = require('finalhandler')
const http = require('http')
const morgan = require('morgan')

// create "middleware"
const logger = morgan('combined')

http.createServer(function (req, res) {
  const done = finalhandler(req, res)
  logger(req, res, function (err) {
    if (err) return done(err)

    // respond to request
    res.setHeader('content-type', 'text/plain')
    res.end('hello, world!')
  })
})
```
## 日志写到文件里
### 单文件
```javascript
const express = require('express')
const fs = require('fs')
const morgan = require('morgan')
const path = require('path')

const app = express()

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

app.get('/', function (req, res) {
  res.send('hello, world!')
})
```
### 日志文件轮换
```javascript
const express = require('express')
const morgan = require('morgan')
const path = require('path')
const rfs = require('rotating-file-stream') // version 2.x

const app = express()

// create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log')
})

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

app.get('/', function (req, res) {
  res.send('hello, world!')
})
```

### split / dual logging
`morgan` 中间件可以按照需要任意使用多次，可以有以下组合：
- 一个记录请求，一个记录响应
- 将所有的请求记录到文件，但是错误输出到控制台
- ......
 
 ```javascript
const express = require('express')
const fs = require('fs')
const morgan = require('morgan')
const path = require('path')

const app = express()

// log only 4xx and 5xx responses to console
app.use(morgan('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}))

// log all requests to access.log
app.use(morgan('common', {
  stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
}))

app.get('/', function (req, res) {
  res.send('hello, world!')
})
 ```
 ### 使用自定义的 token 格式
```javascript
const express = require('express')
const fs = require('fs')
const morgan = require('morgan')
const path = require('path')

const app = express()

// log only 4xx and 5xx responses to console
app.use(morgan('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}))

// log all requests to access.log
app.use(morgan('common', {
  stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
}))

app.get('/', function (req, res) {
  res.send('hello, world!')
})
 ```






