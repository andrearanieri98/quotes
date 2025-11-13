import express from "express";
import pg from "pg";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Legge il file .env

const app = express();
app.use(express.json());
app.use(cors());

// Crea connessione al database Supabase
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Endpoint per ottenere tutte le quotes
app.get("/quotes", async (req, res) => {
  const result = await db.query("SELECT * FROM quotes ORDER BY created_at DESC");
  res.json(result.rows);
});

// Endpoint per aggiungere una quote
app.post("/quotes", async (req, res) => {
  const { content, author } = req.body;
  const result = await db.query(
    "INSERT INTO quotes (content, author) VALUES ($1, $2) RETURNING *",
    [content, author]
  );
  res.json(result.rows[0]);
});

// Avvia il server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server attivo su porta ${PORT}`));
