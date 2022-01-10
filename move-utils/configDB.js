const debug = require('debug')('move:utils')

const configDB = {
  database: process.env.DB_NAME || "move",
  username: process.env.DB_USER || "jair",
  password: process.env.DB_PASS || '12345',
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || "5432",
  dialect: "postgres"
};

module.exports = {
  configDB
};
