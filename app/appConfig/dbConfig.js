const { config } = require("aws-sdk");

require('dotenv').config()
module.exports = {
    HOST: process.env.RDS_HOSTNAME,
    USER: process.env.RDS_USERNAME,
    PASSWORD: process.env.RDS_PASSWORD,
    DB: process.env.RDS_DB_NAME,
    dialect: "mysql",
    dialectOptions: {
      ssl: 'Amazon RDS',
      rejectUnauthorized: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
  