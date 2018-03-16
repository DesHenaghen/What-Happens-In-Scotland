const path = require('path');
const fs = require('fs');
const cwd = path.dirname(fs.realpathSync(__filename));
const { Pool } = require('pg');
const config = require('config.json')(cwd+'/../config/database.json', (process.argv[2]) ? process.argv[2] : 'development');
const pool = new Pool(config.postgres);

fs.readFile(cwd+'/../src/assets/json/scotland-wards.json', 'utf8', (err, topology) => {
  let features = JSON.parse(topology).features;

  features.forEach(feature => {
    //console.log(feature);
    //console.log(feature.geometry.coordinates)
    let polygon_id = feature.properties.WD13CD;
    let polygon_name = feature.properties.WD13NM;
    let polygon_string;


    if (feature.geometry.type === 'Polygon') {
      polygon_string = feature.geometry.type+"((" + feature.geometry.coordinates[0].map(position => `${position[0]} ${position[1]}`).join(', ') + "))";
    } else if (feature.geometry.type === 'MultiPolygon') {
      polygon_string = feature.geometry.type+"(" + feature.geometry.coordinates.map(array => {
        return '(('+array[0].map(position => `${position[0]} ${position[1]}`).join(', ')+'))'
      }).join(', ') + ")";
    }

    insertWard(polygon_id, polygon_name, polygon_string);
  });

});

async function insertWard(id, name, polygon){
  pool.query(
    "INSERT into scotland_wards (id, name, area) values ($1, $2, ST_Multi(ST_GeomFromText($3, 4326)))",
    [id, name, polygon]
  ).catch(e => console.log(e));
}
