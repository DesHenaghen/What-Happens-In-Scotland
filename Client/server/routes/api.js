const fs = require('fs');
const express = require('express');
const { Pool } = require('pg');
const config = require('config.json')('./config/database.json');

const router = express.Router();

const pool = new Pool(config.postgres);

async function getGeoTweets(id){
  const res = await pool
    .query(
      "SELECT t.text, t.user, x.day, x.avg_neg, x.avg_neu, x.avg_neg, x.avg_pos, x.avg_compound, x.total " +
      "FROM ( " +
        "SELECT date::date as day, MAX(date) as max_date, AVG(neg_sent) as avg_neg, AVG(neu_sent) as avg_neu, AVG(pos_sent) as avg_pos, AVG(compound_sent) as avg_compound, COUNT(*) as total "+
        "FROM geo_tweets " +
        "WHERE area_id = $1 " +
        // "AND compound_sent != 0 " +
        "GROUP by day "+
        "ORDER BY day ASC "+
      ") as x INNER JOIN geo_tweets as t ON t.date = x.max_date ",
      [id]
    );

  return res.rows;
}

router.get('/ward_data', async (req, res) => {
  const ward_id = req.query.id;
  const tweets = await getGeoTweets(ward_id);
  parseTwitterData(res, tweets);
});


function parseTwitterData(res, tweets) {
  const values = [];
  let total = 0;
  let last_tweet_text = (tweets.length > 0) ? tweets[tweets.length -1].text : "";
  let last_tweet_user = (tweets.length > 0) ? tweets[tweets.length -1].user : {};

  for (let i = 0; i < tweets.length; i++) {
    values.push({
      x: new Date(tweets[i].day).getTime(),
      y: tweets[i].avg_compound
    });

    total += parseInt(tweets[i].total);
  }

  res.send({
    values,
    total,
    last_tweet: {
      text: last_tweet_text,
      user: last_tweet_user
    }
  });
}


async function getGlasgowTweets(){
  const res = await pool
    .query(
      "SELECT t.text, t.user, x.day, x.avg_neg, x.avg_neu, x.avg_neg, x.avg_pos, x.avg_compound, x.total " +
      "FROM ( " +
        "SELECT date::date as day, MAX(date) as max_date, AVG(neg_sent) as avg_neg, AVG(neu_sent) as avg_neu, AVG(pos_sent) as avg_pos, AVG(compound_sent) as avg_compound, COUNT(*) as total "+
        "FROM glasgow_tweets " +
        // "AND compound_sent != 0 " +
        "GROUP by day "+
        "ORDER BY day ASC "+
      ") as x INNER JOIN glasgow_tweets as t ON t.date = x.max_date ",
    );
  return res.rows;
}

router.get('/glasgow_data', async (req, res) => {
  const tweets = await getGlasgowTweets();
  parseTwitterData(res, tweets);
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
