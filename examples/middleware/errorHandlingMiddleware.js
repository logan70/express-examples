const express = require("express");
const app = express();
const port = 3000;

app.use(function (req, res, next) {
  console.log("Time:", Date.now());
  next();
});

app.get("/", function (req, res, next) {
  console.log("///////");
  next("///");
});

app.use(function (err, req, res, next) {
  console.log("4444444444");
  console.error(err);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
