const fs = require('fs');
const express = require('express');
const { Pool } = require('pg');
const config = require('config.json')('./config/database.json');

const router = express.Router();


const pool = new Pool(config.postgres);

async function getGeoTweets(id){
  const res = await pool
    .query(
      "SELECT date::date as day, AVG(neg_sent) as neg, AVG(pos_sent) as pos, AVG(compound_sent) as compound, COUNT(*) as total " +
      "from geo_tweets " +
      "WHERE area_id = $1 " +
      // "AND compound_sent != 0 " +
      "GROUP BY day " +
      "ORDER BY day ASC",
      [id]
    );
  return res.rows;
}

router.get('/ward_data', async (req, res) => {
  const ward_id = req.query.id;
  const tweets = await getGeoTweets(ward_id);
  const values = [];
  let total = 0;

  for (let i = 0; i < tweets.length; i++) {
    values.push({
      x: new Date(tweets[i].day).getTime(),
      y: tweets[i].compound
    });

    total += parseInt(tweets[i].total);
  }

  res.send({
    values,
    total
  });
});


async function getGlasgowTweets(){
  const res = await pool
    .query(
      "SELECT date::date as day, AVG(neg_sent) as neg, AVG(pos_sent) as pos, AVG(compound_sent) as compound, COUNT(*) as total  " +
      "from glasgow_tweets " +
      //"WHERE compound_sent != 0 " +
      "GROUP BY day " +
      "ORDER BY day ASC"
    );
  return res.rows;
}

router.get('/glasgow_data', async (req, res) => {
  const tweets = await getGlasgowTweets();
  const values = [];
  let total = 0;

  for (let i = 0; i < tweets.length; i++) {
    values.push({
      x: new Date(tweets[i].day).getTime(),
      y: tweets[i].compound
    });

    total += parseInt(tweets[i].total);
  }

  res.send({
    values,
    total
  });
});

router.get('/wards', (req, res) => {
  fs.readFile('./json/glasgow-wards.json', 'utf8', (err, topology) => {
    if (err) {
      console.error(err);
      return res.error(err);
    }

    res.send(topology);
  });
});

module.exports = router;
