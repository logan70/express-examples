const express = require("express");
const app = express();
const port = 3000;

const fs = require("file-system");
// console.log(app.set("env", "production"));
// console.log(app.get("env"));
// app.get("/", function (req, res, next) {
//   fs.readFile("/file-does-not-exist", function (err, data) {
//     if (err) {
//       next(err); // Pass errors to Express.
//     } else {
//       res.send(data);
//     }
//   });
// });

app.get("/", function (req, res, next) {
  setTimeout(function () {
    try {
      throw new Error("BROKEN");
    } catch (err) {
      next(err);
    }
  }, 100);
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
