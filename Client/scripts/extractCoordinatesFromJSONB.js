const { Pool } = require('pg');
const config = require('config.json')('../config/database.json', 'development');
console.log(config.postgres);
const pool = new Pool(config.postgres);

function getAreaIdWardIdFromCoordinates() {
  pool.query(
    "SELECT id, coordinates " +
    "FROM scotland_tweets " +
    "WHERE coordinates IS NOT NULL; "
  )
    .then(res => {
      let queries = "";
      res.rows.forEach(row => {
        let coordString = 'POINT(' + row.coordinates.y + " " + row.coordinates.x + ")";

        queries +=
          // Area Id
          "UPDATE scotland_tweets " +
          "SET area_id = scotland_districts.id " +
          "FROM scotland_districts " +
          "WHERE scotland_tweets.id='" + row.id + "' " +
          "AND ST_Contains(scotland_districts.area, ST_GeomFromText('" + coordString + "', 4326)); " +
          // Ward Id
          "UPDATE scotland_tweets " +
          "SET ward_id = scotland_wards.id " +
          "FROM scotland_wards " +
          "WHERE scotland_tweets.id='" + row.id + "' " +
          "AND ST_Contains(scotland_wards.area, ST_GeomFromText('" + coordString + "', 4326)); ";
      });

      pool.query(queries).then(() => console.log('done')).catch(e => console.error(e))
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
        ).then(() => console.log(polygon_string)).catch(e => console.log(e))
      });
    })
    .catch(e => console.error(e.stack));
}

function updatePlaceCoordinates() {
  pool.query(
    "SELECT id, place " +
    "FROM scotland_tweets "+
    "WHERE place->>'name' != 'Scotland'"
  )
    .then(res => {
      let queries = "";
      res.rows.forEach(row => {
        // console.log(row);
        if (row.place && row.place.bounding_box && row.place.name) {
          // console.log(row.place.name, row.place.bounding_box.coordinates);

          let bbox = row.place.bounding_box;

          let polygon_string = "POLYGON((" + bbox.coordinates[0].map(position => `${position[0]} ${position[1]}`).join(', ') +
            ", " + bbox.coordinates[0][0][0] + " " + bbox.coordinates[0][0][1] + "))";
          // console.log(polygon_string);

          queries +=
            "UPDATE scotland_tweets " +
            "SET place_coordinates = ST_Centroid(ST_GeomFromText('" + polygon_string + "', 4326)) " +
            "WHERE scotland_tweets.id='" + row.id + "'; ";

          console.log(row.id);
        }
      });

      pool.query(queries).then(()=>console.log('done')).catch(e => console.log(e))
    })
    .catch(e => console.error(e.stack));
}

function getAreaIdFromPlace() {
  pool.query(
    "UPDATE scotland_tweets " +
    "SET area_id = scotland_districts.id " +
    "FROM scotland_districts " +
    "WHERE ST_Contains(scotland_districts.area, scotland_tweets.place_coordinates)"
  ).catch(e => console.error(e.stack));
}

// updatePlaceCoordinates();
// getAreaIdFromPlace();
getAreaIdWardIdFromCoordinates();
