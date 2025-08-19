import { strategies } from "../configs/StrategyAndSymbols";

interface Props {
  mode: "strategy" | "symbol";
  value: string;
}
import { createChart,CandlestickSeries } from "lightweight-charts";
import { useEffect, useRef } from "react";


export default function ChartDisplay({ mode, value }:Props) {
  const chartContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainer.current) return;

    // 建立圖表
const chart= createChart(chartContainer.current!, { width: 600, height: 300 });

// 指定線圖 series 型別
const kLineSeires= chart.addSeries(CandlestickSeries);

// 資料
const data = [
      { time: '2025-08-19', open: 100, high: 105, low: 98, close: 103 },
      { time: '2025-08-20', open: 103, high: 108, low: 101, close: 106 },
      { time: '2025-08-21', open: 106, high: 112, low: 105, close: 109 }

];

kLineSeires.setData(data);

    return () => chart.remove(); // 清理圖表，避免重複 render
  }, [mode, value]); // mode 或 value 改變就重新畫圖

  return <div ref={chartContainer} />;
}
