export interface Strategy {
  name: string;
  symbols: string[]; // 該策略關注的標的
}

// 假資料。   未來得要隨著交易紀錄的新增 自動新增按鈕 
export const strategies: Strategy[] = [
  { name: "strategyA", symbols: ["aapl"] },
  { name: "strategyB", symbols: ["aapl", "goog"] },
];

export const symbols = ["aapl", "goog"];
