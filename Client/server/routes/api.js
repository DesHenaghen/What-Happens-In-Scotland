import moment from 'moment';
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

module.exports = router;
