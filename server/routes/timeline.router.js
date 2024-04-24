const express = require("express");
const pool = require("../modules/pool");
const { rejectUnauthenticated } = require("../modules/authenication");
const router = express.Router();

router.get("/get", rejectUnauthenticated, async (req, res) => {
  const client = await pool.connect();
  const user = req.user.id;
  const query = `SELECT * FROM "timeline" WHERE user_id = $1`;

  try {
    client
      .query(query, [user])
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
  } finally {
    client.release();
  }
});

router.get("/get/all", rejectUnauthenticated, async (req, res) => {
  const client = await pool.connect();
  const user = req.user.id;
  const query = `
    SELECT

    pd.month, pd.date, pd.full_date,
    p.id AS "pole_id", p.title AS "pole_title",
    tl.id AS "timeline_id", tl.year

    FROM "timeline" tl

    JOIN "time_pole" p ON p.year_id = tl.id
    JOIN "time_pole_date" pd ON pd.time_pole_id = p.id

    WHERE tl.user_id = $1;
  `;

  try {
    client
      .query(query, [user])
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
  } finally {
    client.release();
  }
});

router.get("/get/id/:year", rejectUnauthenticated, async (req, res) => {
  const client = await pool.connect();
  const user = req.user.id;
  const year = req.params.year;
  const query = `
  SELECT id FROM "timeline"
  WHERE user_id = $1 AND year = $2;
  `;

  try {
    client
      .query(query, [user, year])
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
  } finally {
    client.release();
  }
});

router.get(
  "/get/current/:timelineId",
  rejectUnauthenticated,
  async (req, res) => {
    const client = await pool.connect();
    const user = req.user.id;
    const timelineId = req.params.timelineId;

    const PolesQuery = `
    SELECT 
      pd.year, pd.month, pd.date, pd.full_date, 
      p.title, p.description, p.completed, p.id, p.year_id

    FROM time_pole p

    JOIN time_pole_date pd ON pd.time_pole_id = p.id
    JOIN "user" u ON p.user_id = u.id

    WHERE u.id = $1 AND p.year_id = $2;
    `;
    const SortQuery = `
    SELECT sort FROM "sort_data"
    WHERE year_id = $1;
    `;

    let resData = { poles: [], sortData: "", timelineId: timelineId };

    try {
      client
        .query(PolesQuery, [user, timelineId])
        .then((response) => {
          resData = { ...resData, poles: response.rows };

          pool
            .query(SortQuery, [timelineId])
            .then((response) => {
              resData = { ...resData, sortData: response.rows };
              res.send(resData);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    } finally {
      client.release();
    }
  }
);

router.post("/create", rejectUnauthenticated, async (req, res) => {
  const client = await pool.connect();
  const { title, year } = req.body;
  const user = req.user.id;

  try {
    await client.query("BEGIN");

    // create timeline
    const timelineInsertQuery = `
        INSERT INTO "timeline" (title, year, user_id)
        VALUES ($1, $2, $3)
        RETURNING id;
    `;

    const { rows: timelineRows } = await client.query(timelineInsertQuery, [
      title,
      year,
      user,
    ]);
    const timelineId = timelineRows[0].id;

    // create sort data
    const sortDataInsertQuery = `
        INSERT INTO "sort_data" (year_id)
        VALUES ($1);
    `;
    await client.query(sortDataInsertQuery, [timelineId]);

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

router.delete("/delete/:year", rejectUnauthenticated, async (req, res) => {
  const client = await pool.connect();
  const { year } = req.params;
  const user = req.user.id;
  const query = `
  DELETE FROM "timeline"
  WHERE user_id = $1 AND year = $2;
  `;

  try {
    client
      .query(query, [user, year])
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.log("error deleting timeline", err);
        res.sendStatus(500);
      });
  } catch (err) {
    console.log("error deleting timeline", err);
    res.sendStatus(500);
  } finally {
    client.release();
  }
});
module.exports = router;
