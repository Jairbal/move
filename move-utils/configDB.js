const debug = require('debug')('move:utils')

const configDB = {
  database: process.env.DB_NAME || "move",
  username: process.env.DB_USER || "admin",
  password: process.env.DB_PASS || "admin",
  host: process.env.DB_HOST || "localhost",
  dialect: "postgres"
};

module.exports = {
  configDB
};
