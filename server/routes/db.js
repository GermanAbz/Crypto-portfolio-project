import dotenv from "dotenv";
import pg from "pg";
const { Client } = pg;

dotenv.config();

const db = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});


(async () => {
  try {
    await db.connect();
    console.log("Connected to PostgreSQL");
  } catch (err) {
    console.error("Connection error:", err);
  }
})();

export default db;


/*
CREATE TABLE users(
	id SERIAL PRIMARY KEY,
	email VARCHAR(100) NOT NULL UNIQUE,
	password VARCHAR (100)
);


CREATE TABLE user_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    token_symbol TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    UNIQUE (user_id, token_symbol)
);

*/