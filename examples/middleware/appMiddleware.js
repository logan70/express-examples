const express = require("express");
const app = express();
const port = 3000;

const myLogger = function (req, res, next) {
  console.log("LOGGED");
  next();
};

app.use(myLogger);

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

// 匹配带参数的路由
app.get(
  "/user/:id",
  function (req, res, next) {
    // 如果路径是 /user/0，则跳到下一个路由
    if (req.params.id === "0") next("route");
    // 如果参数 id 不是0，则将控制权交个下一个路由处理函数
    else next();
  },
  function (req, res, next) {
    console.log("REGULAR");
    // send a regular response
    // res.render("regular");
    next();
  }
);
app.get("/user/:id", function (req, res, next) {
  console.log("SPECIAL");
  res.send("special");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
