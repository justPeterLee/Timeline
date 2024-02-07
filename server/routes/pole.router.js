const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
require("dotenv").config();

const { rejectUnauthenticated } = require("../modules/authenication");

router.get("/", rejectUnauthenticated, (req, res) => {
  const query = `
    SELECT p.*, pd.*
    FROM time_pole p
    JOIN time_pole_date pd ON pd.time_pole_id = p.id
    JOIN "user" u ON p.user_id = u.id
    WHERE u.id = $1;
  `;

  pool
    .query(query, [req.user.id])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("ERROR: ", err);
      res.sendStatus(500);
    });
});

router.post("/create", rejectUnauthenticated, async (req, res) => {
  const { title, description, date_data } = req.body;
  const { date, month, year, day, full_date } = date_data;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const timePoleInsertQuery = `
  INSERT INTO time_pole (title, description, user_id)
  VALUES ($1, $2, $3)
  RETURNING id`;
    const timePoleValues = [title, description, req.user.id];
    const { rows: timePoleRows } = await client.query(
      timePoleInsertQuery,
      timePoleValues
    );
    const timePoleId = timePoleRows[0].id;

    const timePoleDateInsertQuery = `
  INSERT INTO time_pole_date (date, month, year, day, full_date, time_pole_id)
  VALUES ($1, $2, $3, $4, $5, $6)`;
    const timePoleDateValues = [date, month, year, day, full_date, timePoleId];
    await client.query(timePoleDateInsertQuery, timePoleDateValues);

    await client.query("COMMIT");
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    await client.query("ROLLBACK");
    res.sendStatus(500);
  } finally {
    client.release();
  }
});

module.exports = router;
