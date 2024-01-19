const pg = require("pg");
require("dotenv").config();

console.log(process.env.DB_USER);

let pool = new pg.Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: "localhost",
  port: 5432,
  database: "timeline",
});

module.exports = pool;
