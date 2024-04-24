const pg = require("pg");
require("dotenv").config();

console.log(process.env.DB_USER);

const pool = new pg.Pool({
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // host: "localhost",
  // port: 5432,
  // database: "timeline",
  connectionString: `postgres://postgres.bmovrzpftbiyuaammqau:${process.env.SUPABASE_PASS}@aws-0-us-west-1.pooler.supabase.com:5432/postgres`,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
