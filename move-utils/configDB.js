const debug = require('debug')('move:utils')

const configDB = {
  database: process.env.DB_NAME || "move",
  username: process.env.DB_USER || "Jair",
  password: process.env.DB_PASS || "admintesis",
  host: process.env.DB_HOST || "postgresql-46413-0.cloudclusters.net",
  port: process.env.DB_PORT || "18819",
  dialect: "postgres"
};

module.exports = {
  configDB
};
