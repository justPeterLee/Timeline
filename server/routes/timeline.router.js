const express = require("express");
const pool = require("../modules/pool");
const { rejectUnauthenticated } = require("../modules/authenication");
const router = express.Router();

router.get("/get", rejectUnauthenticated, (req, res) => {
  console.log("test");
  res.sendStatus(200);
});

module.exports = router;
