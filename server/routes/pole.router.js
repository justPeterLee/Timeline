const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
require("dotenv").config();

router.get("/", (req, res) => {
  const query = "SELECT * FROM user;";
  pool
    .query(query)
    .then((result) => {
      console.log("server: ", result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR: ", err);
      res.sendStatus(500);
    });
});

module.exports = router;
