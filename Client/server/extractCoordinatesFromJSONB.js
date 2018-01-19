const { Pool } = require('pg');
const config = require('config.json')('../config/database.json', 'development');

const pool = new Pool(config.postgres);

pool.query(
  "SELECT id, coordinates " +
  "FROM geo_tweets"
)
  .then(res => {
    res.rows.forEach(row => {
      let coordString = row.coordinates.coordinates;
      coordString = "("+coordString[1]+","+coordString[0]+")";

      pool.query(
        "UPDATE geo_tweets " +
        "SET tmp_coordinates = $1::point " +
        "WHERE id=$2 ",
        [coordString, row.id]
      ).then(
        "UPDATE geo_tweets " +
        "SET area_id = glasgow_wards.id " +
        "FROM glasgow_wards " +
        "WHERE glasgow_wards.area @> geo_tweets.tmp_coordinates "
      )
        .catch(e => console.log(e))
    });
  })
  .catch(e => console.error(e.stack));
