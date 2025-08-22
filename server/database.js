import sqlite3 from "sqlite3";
import { open } from "sqlite";

// 打開 SQLite
export async function getKlineData(ticker, limit = 1000) {
  const db = await open({
    filename: "kline_data.db",
    driver: sqlite3.Database
  });

  const rows = await db.all(`
    SELECT time, open, high, low, close
    FROM kline
    WHERE ticker = ?
    ORDER BY time ASC
    LIMIT ?
  `, [ticker, limit]);

  await db.close();

  // 轉換時間成 UNIX timestamp (秒)
  const data = rows.map(r => ({
    time: Math.floor(new Date(r.time).getTime() / 1000),
    open: r.open,
    high: r.high,
    low: r.low,
    close: r.close
  }));

  return data;
}

