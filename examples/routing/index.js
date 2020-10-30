const express = require("express");
const app = express();
const port = 3000;
const birds = require("./expressRouter");

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

// 匹配带参数的路由

app.get("/users/:userId/books/:bookId", function (req, res) {
  res.send(req.params);
});

// app.route() 创建的链式路由
app
  .route("/book")
  .get((req, res) => res.send("Get a random book"))
  .post((req, res) => res.send("Add a book"))
  .put((req, res) => res.send("Update the book"));

// express.Router 创建的模块化的路由处理程序。
app.use("/birds", birds);

// 处理 404 ，这个函数必须得放在所有函数的最下面
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
