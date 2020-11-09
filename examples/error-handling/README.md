**错误处理**是指Express如何捕获和处理同步和异步发生的错误。Express提供了一个默认的错误处理程序，因此你不需要在开始时编写自己的错误处理程序。
## 捕获错误
确保 Express 捕获发生在运行路由处理程序和中间件的所有错误，非常重要。..........
路由处理程序和中间件的同步代码抛出错误，Express 会捕获并且处理。

```javascript
app.get('/', function (req, res) {
  throw new Error('BROKEN') // Express will catch this on its own.
})
```
对于异步代码发生的错误，必须把错误传给 `next()`， 然后Express会捕获并处理

```javascript
app.get('/', function (req, res, next) {
  fs.readFile('/file-does-not-exist', function (err, data) {
    if (err) {
      next(err) // Pass errors to Express.
    } else {
      res.send(data)
    }
  })
})
```

从 Express 5 开始，路由处理程序和中间件返回一个 `Promise`，当这个 `Promise` rejected 或者抛出错误时，会自动调用 `next(value)`。
```javascript
app.get('/user/:id', async function (req, res, next) {
  var user = await getUserById(req.params.id)
  res.send(user)
})
```
例如上面的例子，如果 `getUserById` 抛出错误或者 rejected， `next`会被调用，参数为抛出的错误或者 rejected 的值。如果没有rejected 的值，Express router 会给 next 提供一个默认的 Error 对象。

如果给 `next()` 传递了参数（除了`'route'`），这个参数会被认为是一个 error，并且会跳过其余的路由处理程序和中间件函数。
捕获异步代码中的错误，需要通过`try...catch`捕获错误并传递给`next()`.如下：
```javascript
app.get('/', function (req, res, next) {
  setTimeout(function () {
    try {
      throw new Error('BROKEN')
    } catch (err) {
      next(err)
    }
  }, 100)
})
```
## 默认的错误处理程序
Express 有一个内置的错误处理程序，负责处理应用程序中可能遇到的任何错误。这个默认的错误处理程序添加在中间件函数栈的末尾。
如果给 `next()` 传递了参数，并且在自定义的错误处理程序中处理，而是在内置的错误处理程序中。这个错误会通过栈跟踪写在客户端。

当写入错误时，以下信息会被添加进response中：
- ` res.statusCod` 是从 ` err.status` 设置的。如果此值在4xx或5xx范围之外，则将其设置为500。
- ` res.statusMessage` 根据状态码来设置，在生产环境中，主体将是状态代码消息的HTML，否则，将会是 `err.stack`。
- 声明在 `err.headers`对象中的任何头

## 写错误处理程序
定义错误处理程序跟其他的中间件函数是一样的，除了错误处理程序有4个参数`(err, req, res, next)`。在`app.use()`和路由调用之后定义错误处理中间件。
```javascript
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```
在错误处理程序中如果不调用`next`，那就要自己结束 请求/响应循环，否则这些请求会一直挂起，还不能被垃圾回收。

```javascript
function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}
```



