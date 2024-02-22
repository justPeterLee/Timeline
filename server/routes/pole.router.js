const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
require("dotenv").config();

const { rejectUnauthenticated } = require("../modules/authenication");

router.get("/", rejectUnauthenticated, (req, res) => {
  const query = `
    SELECT pd.full_date, pd.time_pole_id, pd.id AS "date_id", p.*
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

router.put("/update", rejectUnauthenticated, async (req, res) => {
  const { id, title, description, date_data } = req.body;
  const { date, month, year, day, full_date } = date_data;
  const timePoleQuery = `
  UPDATE time_pole
  SET title = $1,
      description = $2
  WHERE id = $3;
  `;
  const timePoleDateQuery = `
  UPDATE time_pole_date
  SET date = $1,
      month = $2,
      year = $3,
      day = $4,
      full_date = $5
  WHERE time_pole_id = $6;
  `;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(timePoleQuery, [title, description, id]);
    await client.query(timePoleDateQuery, [
      date,
      month,
      year,
      day,
      full_date,
      id,
    ]);
    await client.query("COMMIT");
    res.sendStatus(200);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error updating time pole: ", err);
    res.status(500).send("Error updating time pole");
  } finally {
    client.release();
  }
  // res.sendStatus(200);
});
module.exports = router;
