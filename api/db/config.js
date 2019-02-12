var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'localhost',
    user : 'phpuser',
    password : 'password',
    database : 'map'
  }
});

module.exports = {
  knex
}
