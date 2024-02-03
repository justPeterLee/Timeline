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
  console.log(password);
  const query = `
    INSERT INTO "user" (username, password, email)
    VALUES ($1, $2, $3) 
    ON CONFLICT (email) DO NOTHING RETURNING *; `;

  pool
    .query(query, [user, password, email])
    .then((response) => {
      if (response.rows[0]) {
        res.sendStatus(201);
      } else {
        res.status(500).json({ error: "Email alreay used" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// login
// router.get('/login', (req,res)=>{

// })

router.post("/login", (req, res) => {});

module.exports = router;
