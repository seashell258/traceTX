// backend.ts (Node/Express)
import express from 'express';
import { getKlineData } from './database.js';

const app = express();

app.get('/api/kline', async (req, res) => {
  const ticker = req.query.ticker;
  const data = await getKlineData(ticker, 1000);
  res.json(data);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));