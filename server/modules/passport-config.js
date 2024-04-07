const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("./pool");
const { comparePassword } = require("./encryption");

// function

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const query = `
        SELECT * FROM "user" WHERE id = $1
    `;
  pool
    .query(query, [id])
    .then((response) => {
      const user = response.rows[0];

      if (user) {
        delete user.password;
        delete user.email;
        done(null, user);
      } else {
        done(null, null);
      }
    })
    .catch((err) => {
      console.log("Error with deserializing user ", err);
      done(err, null);
    });
});

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      //   passReqToCallback: true,
    },
    (username, password, done) => {
      console.log("in here");
      const query = `
          SELECT * FROM "user" WHERE "username" = $1 OR  "email" = $2
        `;
      pool
        .query(query, [username, username]) // Pass username twice for both username and email
        .then((response) => {
          const user = response.rows[0];
          console.log("then", user);
          if (user && comparePassword(password, user.password)) {
            console.log("success");
            done(null, user); // Authentication succeeded
          } else {
            console.log("not user");
            done(null, null); // Authentication failed
          }
        })
        .catch((err) => {
          console.log("failed");
          console.log("Error with user query ", err);
          done(err, null); // Error occurred
        });
    }
  )
);

module.exports = passport;
