
require("dotenv").config();
const { Pool } = require("pg");

const database = process.env.PGDATABASE;

const isDocker = process.env.NODE_ENV === 'production';

const PGHOST= isDocker ? process.env.PGHOSTPROD : process.env.PGHOST

const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${PGHOST}:${process.env.PGPORT}/${database}`;


const pool = new Pool({
  connectionString: connectionString,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  end: () => pool.end(),
};