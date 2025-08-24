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


// 後端即時根據新抓的 candle，透過 websocket 傳到前端畫圖
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  let index = 0;
  const fakeCandles = [
    { time: 1755856140, open: 85, high: 85.20, low: 84.80, close: 85.20, volume: 200 },
    { time: 1755856200, open: 86, high: 86.40, low: 86, close: 86.20, volume: 180 },
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
