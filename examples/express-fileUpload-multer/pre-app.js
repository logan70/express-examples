const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.listen(3000, function (err) {
  if (!err) {
    console.log("server is listening 3000 port");
  } else {
    console.log(err);
  }
});
app.use(bodyParser.urlencoded({ extended: false }));
app.post("/", function (req, res) {
  console.log(req.body);
});
