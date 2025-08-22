import { WebSocketServer } from 'ws';

// 建立一個 WS Server，監聽 8080 port
const ws = new WebSocketServer({ port: 8080 });

// 假資料池（K 線資料）
const fakeCandles = [
  { time: 1755611113, open: 103, high: 105, low: 99, close: 102, volume: 200 },
  { time: 1755611173, open: 102, high: 102, low: 101, close: 104, volume: 180 },
  { time: 1755611233, open: 104, high: 101, low: 100, close: 106, volume: 220 },
  { time: 1755611293, open: 106, high: 116, low: 105, close: 109, volume: 300 },
];

// 當有 client 連上來
ws.on("connection", (ws) => {
  console.log("Client connected");

  let index = 0;

  // 每 2 秒推一根新的 K 線
  const interval = setInterval(() => {
    if (index < fakeCandles.length) {
      ws.send(JSON.stringify({ type: "candle", data: fakeCandles[index] }));
      index++;
    } else {
      // 資料發完就清掉 interval
      clearInterval(interval);
    }
  }, 5000);

  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

console.log("WebSocket server running on ws://localhost:8080");
