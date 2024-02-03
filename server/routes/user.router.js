const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");

const { encryptPassword } = require("../modules/encryption");
// register
// router.get("/register", (req,res)=>{

// })

router.post("/register", (req, res) => {
  const { user, email, pass } = req.body;
  const password = encryptPassword(pass);
});

// login
// router.get('/login', (req,res)=>{

// })

router.post("/login", (req, res) => {});

module.exports = router;
