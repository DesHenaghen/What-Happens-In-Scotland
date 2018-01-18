const fs = require('fs');
const express = require('express');
const { Pool } = require('pg');
const config = require('config.json')('./config/database.json');

const router = express.Router();


const pool = new Pool(config.postgres);

async function getTweets(){
  const res = await pool
    .query(
      "SELECT date::date as day, AVG(neg_sent) as neg, AVG(pos_sent) as pos, AVG(compound_sent) as compound " +
      "from glasgow_tweets " +
      "GROUP BY day " +
      "ORDER BY day ASC"
    );
  return res.rows;
}

router.get('/data', async (req, res) => {
  const tweets = await getTweets();
  const values = [];
  // const date = moment().month(11).date(1);
  // for (let i = 0; i < 30; i++) {
  for (let i = 0; i < tweets.length; i++) {
    values.push({
      //x: date.valueOf(),
      x: new Date(tweets[i].day).getTime(),
      //y: Math.random()
      y: tweets[i].compound
    });

    //date.add(1, 'day');
  }

  res.send(values);
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
