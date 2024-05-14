const pg = require('pg');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors')


const corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200
};

const port=3000;
/* 
const pool = new pg.Pool({
    user: 'secadv',
    host: 'db',
    database: 'pxldb',
    password: 'ilovesecurity',
    port: 5432,
    connectionTimeoutMillis: 5000
}) */

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  connectionTimeoutMillis: 5000
})

console.log("Connecting...:")

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/authenticate/:username/:password', async (request, response) => {
  const { username, password } = request.params;
  const query = `SELECT * FROM users WHERE user_name=$1 AND password=crypt($2, password)`;
  console.log(query);
  pool.query(query, [username, password], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)});
});


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

