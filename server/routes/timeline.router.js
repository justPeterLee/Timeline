const express = require("express");
const pool = require("../modules/pool");
const { rejectUnauthenticated } = require("../modules/authenication");
const router = express.Router();

router.get("/get", rejectUnauthenticated, async (req, res) => {
  const user = req.user.id;
  const query = `SELECT * FROM "timeline" WHERE user_id = $1`;
  const client = await pool.connect();

  try {
    client.query(query, [user]).then((response) => {
      console.log(response.rows);
      res.send(response.rows);
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  } finally {
    client.release();
  }
});

router.get("/get/all", rejectUnauthenticated, async (req, res) => {
  const user = req.user.id;
  const query = `
  SELECT 
  pd.year, pd.month, pd.date, pd.full_date, pd.time_pole_id, pd.id AS "date_id",
  p.id as "pole_id", p.title as "pole_title", p.description as "pole_description", 
  y.* 
  
  FROM "timeline" y
  JOIN t
  `;
  const client = await pool.connect();

  try {
    client;
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  } finally {
    client.release();
  }
});

router.get("/get/:year", rejectUnauthenticated, async (req, res) => {
  const user = req.user.id;
  const year = req.params.year;
  const query = `
  SELECT id FROM "timeline"
  WHERE user_id = $1 AND year = $2;
  `;
  const client = await pool.connect();

  try {
    client.query(query, [user, year]).then((response) => {
      console.log(response.rows);
      res.send(response.rows);
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  } finally {
    client.release();
  }
});

router.post("/create", rejectUnauthenticated, async (req, res) => {
  const { title, year } = req.body;
  const user = req.user.id;
  const query = `
    INSERT INTO "timeline" (title, year, user_id)
    VALUES ($1, $2, $3);
  `;
  const client = await pool.connect();

  try {
    client.query(query, [title, year, user]).then(() => {
      res.sendStatus(201);
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  } finally {
    client.release();
  }
});

module.exports = router;
