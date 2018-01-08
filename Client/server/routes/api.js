const moment = require('moment');
const fs = require('fs');
const express = require('express');

const router = express.Router();

router.get('/data', (req, res) => {
  const values = [];
  const date = moment().month(11).date(1);
  for (let i = 0; i < 30; i++) {
    values.push({
      x: date.valueOf(),
      y: Math.random()
    });

    date.add(1, 'day');
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
