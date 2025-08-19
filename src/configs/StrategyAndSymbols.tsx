// types.ts
export interface Trade {
  time: string;   // 交易時間
  action: "buy" | "sell";
  price: number;
  strategy: string; // 來自哪個策略
  symbol: string;   // 交易標的
}

export interface Strategy {
  name: string;
  symbols: string[]; // 該策略關注的標的
}

// 假資料
export const strategies: Strategy[] = [
  { name: "A策略", symbols: ["no1", "no2", "no3"] },
  { name: "B策略", symbols: ["no1", "no2", "no4"] },
];

export const symbols = ["no1", "no2", "no3", "no4"];
