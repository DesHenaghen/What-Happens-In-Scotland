const { Pool } = require('pg');
const config = require('config.json')('../config/database.json', 'development');

const pool = new Pool(config.postgres);

function updateScotlandGeoTweetsArea() {
  pool.query(
    "SELECT id, coordinates " +
    "FROM scotland_geo_tweets"
  )
    .then(res => {
      res.rows.forEach(row => {
        let coordString = 'POINT(' + row.coordinates.y + " " + row.coordinates.x + ")";
        console.log(coordString, row.id);

        pool.query(
          "UPDATE scotland_geo_tweets " +
          "SET area_id = scotland_districts.id " +
          "FROM scotland_districts " +
          "WHERE scotland_geo_tweets.id=$2 " +
          "AND ST_Contains(scotland_districts.area, ST_GeomFromText($1, 4326))",
          [coordString, row.id]
        ).catch(e => console.log(e))
      });
    })
    .catch(e => console.error(e.stack));
}

function updateScotlandTweetsArea() {
  pool.query(
    "SELECT id, place " +
    "FROM scotland_tweets"
  )
    .then(res => {
      res.rows.forEach(row => {
        console.log(row.place.name, row.place.bounding_box.coordinates);

        let bbox = row.place.bounding_box;

        let polygon_string = "POLYGON((" + bbox.coordinates[0].map(position => `${position[0]} ${position[1]}`).join(', ') +
          ", " + bbox.coordinates[0][0][0] +" " + bbox.coordinates[0][0][1] +"))";
        console.log(polygon_string);

        pool.query(
          "UPDATE scotland_tweets " +
          "SET area_id = scotland_districts.id " +
          "FROM scotland_districts " +
          "WHERE scotland_tweets.id=$2 " +
          "AND ST_Contains(scotland_districts.area, ST_Centroid(ST_GeomFromText($1, 4326)))",
          [polygon_string, row.id]
        ).catch(e => console.log(e))
      });
    })
    .catch(e => console.error(e.stack));
}

updateScotlandGeoTweetsArea();
updateScotlandTweetsArea();
