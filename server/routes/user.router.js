const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");
const passport = require("../modules/passport-config");
const { encryptPassword } = require("../modules/encryption");
const { rejectUnauthenticated } = require("../modules/authenication");

router.get("/", rejectUnauthenticated, (req, res) => {
  res.send(req.user);
});

router.post("/register", async (req, res) => {
  const client = await pool.connect();
  const { user, email, pass } = req.body;
  const password = encryptPassword(pass);
  const query = `
    INSERT INTO "user" (username, password, email)
    VALUES ($1, $2, $3) 
    ON CONFLICT (email) DO NOTHING RETURNING *; `;

  try {
    client
      .query(query, [user, password, email])
      .then((response) => {
        if (response.rows[0]) {
          res.sendStatus(201);
        } else {
          res.status(500).json({ error: "email is already registered" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

router.post("/logout", (req, res) => {
  req.logout();
  res.sendStatus(200);
});
module.exports = router;
