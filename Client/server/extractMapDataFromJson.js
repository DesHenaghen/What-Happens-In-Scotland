const fs = require('fs');
const { Pool } = require('pg');
const config = require('config.json')('../config/database.json');

const pool = new Pool(config.postgres);

fs.readFile('../src/assets/json/glasgow-wards.json', 'utf8', (err, topology) => {
    let features = JSON.parse(topology).features;

    features.forEach(feature => {
      console.log(feature);
      let polygon_id = feature.properties.WD13CD;
      let polygon_name = feature.properties.WD13NM;
      let polygon_string = "("+feature.geometry.coordinates[0].map(position => `(${position[1]}, ${position[0]})`).join(', ')+")";

      insertWard(polygon_id, polygon_name, polygon_string);
    });

});

async function insertWard(id, name, polygon){
  pool.query(
      "INSERT into glasgow_wards values ($1, $2, $3)",
      [id, name, polygon]
    ).catch(e => console.log(e));
}
