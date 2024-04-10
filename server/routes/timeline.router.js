const express = require("express");
const pool = require("../modules/pool");
const { rejectUnauthenticated } = require("../modules/authenication");
const router = express.Router();

router.get("/get", rejectUnauthenticated, async (req, res) => {
  const user = req.user.id;
  const query = `SELECT * FROM "timeline" WHERE user_id = $1`;
  const client = await pool.connect();

  try {
    client
      .query(query, [user])
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
  } finally {
    client.release();
  }
});

// router.get("/get/all", rejectUnauthenticated, async (req, res) => {
//   const user = req.user.id;
//   const query = `
//   SELECT
//   pd.year, pd.month, pd.date, pd.full_date, pd.time_pole_id, pd.id AS "date_id",
//   p.id as "pole_id", p.title as "pole_title", p.description as "pole_description",
//   y.*

//   FROM "timeline" y
//   JOIN t
//   `;
//   const client = await pool.connect();

//   try {
//     client;
//   } catch (err) {
//     console.log(err);
//     res.sendStatus(500);
//   } finally {
//     client.release();
//   }
// });

router.get("/get/id/:year", rejectUnauthenticated, async (req, res) => {
  const user = req.user.id;
  const year = req.params.year;
  const query = `
  SELECT id FROM "timeline"
  WHERE user_id = $1 AND year = $2;
  `;
  const client = await pool.connect();

  try {
    client
      .query(query, [user, year])
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
  } finally {
    client.release();
  }
});

router.get(
  "/get/current/:timelineId",
  rejectUnauthenticated,
  async (req, res) => {
    const user = req.user.id;
    const timelineId = req.params.timelineId;

    const PolesQuery = `
    SELECT pd.year, pd.month, pd.date, pd.full_date, pd.time_pole_id, pd.id AS "date_id", p.*
    FROM time_pole p
    JOIN time_pole_date pd ON pd.time_pole_id = p.id
    JOIN "user" u ON p.user_id = u.id
    WHERE u.id = $1 AND p.year_id = $2;
    `;
    const SortQuery = `
    SELECT sort FROM "sort_data"
    WHERE year_id = $1;
    `;

    let resData = { poles: [], sortData: "" };

    try {
      pool
        .query(PolesQuery, [user, timelineId])
        .then((response) => {
          //   console.log(response.rows);
          resData = { ...resData, poles: response.rows };

          pool
            .query(SortQuery, [timelineId])
            .then((response) => {
              resData = { ...resData, sortData: response.rows };
              console.log(resData);
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
    }
  }
);

router.get(
  "/get/sort-data/:timelineId",
  rejectUnauthenticated,
  async (req, res) => {
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
  }
);
router.post("/create", rejectUnauthenticated, async (req, res) => {
  const { title, year } = req.body;
  const user = req.user.id;
  const query = `
    INSERT INTO "timeline" (title, year, user_id)
    VALUES ($1, $2, $3)
    RETURNING id, year;
  `;

  try {
    pool
      .query(query, [title, year, user])
      .then((response) => {
        console.log(response.rows);
        res.send(response.rows);
      })
      .catch((err) => {
        console.log("error:", err);
        res.sendStatus(500);
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
