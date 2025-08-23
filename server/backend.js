// server.ts
import express from "express";
import { WebSocketServer } from "ws";
import { getKlineData } from "./database.js";

const app = express();
const server = app.listen(3000, () => {
  console.log("HTTP + WS server running on http://localhost:3000");
});

// REST API
app.get("/api/kline", async (req, res) => {
  const ticker = req.query.ticker;
  console.log(ticker);
  const data = await getKlineData(ticker, 1000);
  res.json(data);
});

// WebSocket Server (掛在同一個 server 上)
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  let index = 0;
  const fakeCandles = [
    { time: 1755611113, open: 103, high: 105, low: 99, close: 102, volume: 200 },
    { time: 1755611173, open: 102, high: 102, low: 101, close: 104, volume: 180 },
    { time: 1755611233, open: 104, high: 101, low: 100, close: 106, volume: 220 },
    { time: 1755611293, open: 106, high: 116, low: 105, close: 109, volume: 300 },
  ];

  const interval = setInterval(() => {
    if (index < fakeCandles.length) {
      ws.send(JSON.stringify({ type: "candle", data: fakeCandles[index] }));
      index++;
    } else {
      clearInterval(interval);
    }
  }, 5000);

  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});
