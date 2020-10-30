const express = require("express");
const router = express.Router();
// router 是一个完整的路由系统
router.use((req, res, next) => {
  console.log("Time:", Date.now());
  next();
});

// 实际匹配路径是 /birds/
router.get("/", (req, res) => {
  res.send("Birds home page");
});
// 实际匹配路径是 /birds/about
router.get("/about", (req, res) => {
  res.send("About birds");
});

module.exports = router;
