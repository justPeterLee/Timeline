const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");
const passport = require("../modules/passport-config");
const { encryptPassword } = require("../modules/encryption");
const { rejectUnauthenticated } = require("../modules/authenication");

// register
// router.get("/register", (req,res)=>{

// })
router.get("/", rejectUnauthenticated, (req, res) => {
  res.send(req.user);
});
router.post("/register", (req, res) => {
  const { user, email, pass } = req.body;
  const password = encryptPassword(pass);
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
        res.status(500).json({ error: "email is already registered" });
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

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

// router.get("/logout", (req, res) => {
//   // Regenerate the session ID
//   req.session.regenerate((err) => {
//     if (err) {
//       console.error("Error regenerating session ID:", err);
//       return res.status(500).send("Internal Server Error");
//     }
//     // Redirect or perform any other action after session regeneration
//     res.redirect("/");
//   });
// });

router.post("/logout", (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});
module.exports = router;
