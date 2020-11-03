const express = require("express");
const app = express();
const router = express.Router();

const port = 3000;

router.use(function (req, res, next) {
  console.log("Time:", Date.now());
  next();
});

// 处理任意 HTTP 请求方式的 /user/:id 路径
router.use(
  "/user/:id",
  function (req, res, next) {
    console.log("Request URL:", req.originalUrl);
    next();
  },
  function (req, res, next) {
    console.log("Request Type:", req.method);
    next();
  }
);
// 处理 get 方式的 /user/:id 路径
router.get(
  "/user/:id",
  function (req, res, next) {
    // 如果User ID = 0,
    if (req.params.id == 0) next("route");
    else next();
  },
  function (req, res, next) {
    // render a regular page
    // res.render("regular");
    console.log("regular");
    next();
  }
);
router.get("/user/:id", function (req, res, next) {
  console.log(req.params.id);
  res.send("special");
});

// 挂载router示例到app
app.use("/", router);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
