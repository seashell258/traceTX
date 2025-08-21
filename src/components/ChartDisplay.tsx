import { strategies } from "../configs/StrategyAndSymbols";
import { allMarkersByStrategy,allMarkersBySymbol } from "./tx-log";

interface Props {
  mode: "strategy" | "symbol";
  strategyValue: string;
  symbolValue: string
}
import { createSeriesMarkers, createChart, CandlestickSeries } from "lightweight-charts";
import type { SeriesMarker } from 'lightweight-charts';
import { useEffect, useRef } from "react";


export default function ChartDisplay({ mode, strategyValue,symbolValue }: Props) {
  const chartContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainer.current) return;

    // 建立圖表
    const chart = createChart(chartContainer.current!, { width: 900, height: 600 });

    // 指定線圖 series 型別
    const kLineSeires = chart.addSeries(CandlestickSeries);

    // 資料
    const data = [
      { time: '2025-08-19', open: 100, high: 105, low: 98, close: 103 },
      { time: '2025-08-20', open: 103, high: 108, low: 101, close: 106 },
      { time: '2025-08-21', open: 106, high: 112, low: 105, close: 109 }

    ];

    kLineSeires.setData(data);

//#region marker語法試驗區 
/*
    const markers: SeriesMarker<any>[] = ([
      {
        color: 'green',
        position: 'belowBar',   // 買入 → 標記在 K 線下方
        shape: 'arrowUp',
        time: '2025-08-19',
        price: 153,
        text: 'Buy 100@103',   // 顯示說明
      },
    ]);

    createSeriesMarkers(kLineSeires, markers);
    */
//endregion

//#region mvp 
console.log('strategy:',strategyValue,'symbol:',symbolValue)
    // Retrieve the markers directly in a single line
    const chartMarkers = allMarkersByStrategy.get(strategyValue)?.get(symbolValue) || [];
    // Now `chartMarkers` is either an array of the correct markers or an empty array
    console.log(chartMarkers);
//endregion

    createSeriesMarkers(kLineSeires, chartMarkers);
    return () => chart.remove(); // 清理圖表，避免重複 render
  }, [mode, strategyValue,symbolValue]); // mode 或 value 改變就重新畫圖

  return <div ref={chartContainer} />;
}
