### 1、安装 express
`npm install express --save` 或者 `yarn add express`

### 2、启动 express 服务
在 `index.js` 文件中，添加一下代码：
```javascript
const express = require("express");
const app = express();
const port = 3000;
app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```
运行该文件

`node index.js`

应用程序会启动服务器，并监听端口3000。并以“Hello Express!”来响应针对根路由的请求。

在浏览器中输入[http://localhost:3000/](http://localhost:3000/)可以查看