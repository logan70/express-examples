/**
 * 在其他 app.use() 和路由调用之后，最后定义错误处理中间件
 */
const express = require('express')

const app = express()
const port = 3000

app.get('/', () => {
  throw new Error('Something failed!')
})

// log error info
app.use(function logError(err, req, res, next) {
  console.error(err)
  next(err)
})

// error handler
app.use(function errorHandler(err, req, res, next) {
  if (!err) return next()
  res.status(404)
  res.send(err.message || 'Server Error!' )
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
