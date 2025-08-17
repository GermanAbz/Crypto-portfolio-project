import express from "express";
import cors from "cors";
import { getPrice } from "./getPrice.js";
import { getTickers } from "./getTickers.js";
import bcrypt from "bcrypt";
import db from "./db.js";

const app = express();
const port = 3000;
const saltRounds = 10;

app.use(express.json());
app.use(cors());


app.get("/api/price", async (req, res) => {
  const prices = await getPrice();
  if (!prices) {
    res.status(500).send("Could not fetch prices");
  } else {
    res.json(prices); 
  }
});

app.get("/api/tickers", async (req, res) => {
  const tickers = await getTickers();
  if (!tickers) {
    res.status(500).send("Could not fetch tickers");
  } else {
    res.json(tickers); 
  }
});


app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await db.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [email, hashedPassword]
    );


    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    res.json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/user_tokens", async (req, res) => {
  const { email } = req.query;
  try {
    const userResult = await db.query("SELECT id FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) return res.status(404).json({ error: "User not found" });
    const userId = userResult.rows[0].id;

    const tokensResult = await db.query(
      "SELECT token_symbol, amount FROM user_tokens WHERE user_id = $1",
      [userId]
    );

    const symbolToTitleMap = {
      btc: "Bitcoin",
      eth: "Ethereum",
      xrp: "XRP",
      usdt: "USDT",
      bnb: "BNB",
      sol: "Solana",
      usdc: "USDC",
      lidStEth: "Lido Staked Ether",
      doge: "Dogecoin",
    };

    const notes = tokensResult.rows.map(({ token_symbol, amount }) => ({
      title: symbolToTitleMap[token_symbol] || token_symbol,
      content: amount,
    }));

    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


app.post("/api/user_tokens", async (req, res) => {
  const { email, token_symbol, amount, title } = req.body;
  try {
    const userResult = await db.query("SELECT id FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) return res.status(404).json({ error: "User not found" });
    const userId = userResult.rows[0].id;

    
    await db.query(
      `INSERT INTO user_tokens (user_id, token_symbol, amount)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, token_symbol)
       DO UPDATE SET amount = EXCLUDED.amount`,
      [userId, token_symbol, amount]
    );

    res.json({ message: "Token saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/api/user_tokens", async (req, res) => {
  const { email, token_symbol, amount } = req.body;
  try {
    const userResult = await db.query("SELECT id FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) return res.status(404).json({ error: "User not found" });
    const userId = userResult.rows[0].id;

    await db.query(
      "UPDATE user_tokens SET amount = $1 WHERE user_id = $2 AND token_symbol = $3",
      [amount, userId, token_symbol]
    );

    res.json({ message: "Token updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/api/user_tokens", async (req, res) => {
  const { email, token_symbol } = req.body;
  try {
    const userResult = await db.query("SELECT id FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) return res.status(404).json({ error: "User not found" });
    const userId = userResult.rows[0].id;

    await db.query(
      "DELETE FROM user_tokens WHERE user_id = $1 AND token_symbol = $2",
      [userId, token_symbol]
    );

    res.json({ message: "Token deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});