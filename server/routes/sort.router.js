const express = require("express");
const pool = require("../modules/pool");
const { rejectUnauthenticated } = require("../modules/authenication");
const router = express.Router();

router.get("/get/:timelineId", rejectUnauthenticated, async (req, res) => {
  // const user = req.user.id;
  const timelineId = req.params.timelineId;
  const query = `
      SELECT sort FROM "sort_data" 
      WHERE year_id = $1;
      `;

  try {
    pool
      .query(query, [timelineId])
      .then((response) => {
        res.send(response.rows);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post("/post", rejectUnauthenticated, async (req, res) => {
  const { sortData, timelineId } = req.body;
  const query = `
    INSERT INTO "sort_data" (sort, year_id)
    VALUES ($1, $2)
    RETURNING sort;
    `;
  try {
    pool
      .query(query, [sortData, timelineId])
      .then((response) => {
        res.send(response.rows);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.put("/put", rejectUnauthenticated, async (req, res) => {
  const { timelineId, sortData } = req.body;
  const query = `
    UPDATE "sort_data"
    SET sort = $1
    WHERE year_id = $2
    RETURNING sort;
    `;

  console.log(timelineId);

  try {
    pool
      .query(query, [sortData, timelineId])
      .then((response) => {
        console.log(response.rows);
        res.send(response.rows);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
module.exports = router;
