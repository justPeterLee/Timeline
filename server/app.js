const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const sessionMiddleware = require("./modules/session");
const passport = require("./modules/passport-config");

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const poleRouter = require("./routes/pole.router");
app.use("/api/v1", poleRouter);

const userActionRouter = require("./routes/user.router");
app.use("/api/v1/userAction", userActionRouter);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
