import { strategies } from "../configs/StrategyAndSymbols";
import { allMarkersByStrategy, allMarkersBySymbol } from "./tx-log";

interface Props {
  mode: "strategy" | "symbol";
  strategyValue: string;
  symbolValue: string
}
import { createSeriesMarkers, createChart, CandlestickSeries } from "lightweight-charts";
import type { SeriesMarker,UTCTimestamp,CandlestickData } from 'lightweight-charts';
import { useEffect, useRef } from "react";


export default function ChartDisplay({ mode, strategyValue, symbolValue }: Props) {
  const chartContainer = useRef<HTMLDivElement>(null);
    const wsRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    if (!chartContainer.current) return;

    // 建立圖表
    const chart = createChart(chartContainer.current!, { width: 900, height: 600,timeScale:{
      timeVisible:true
    }});

    // 指定線圖 series 型別
    const kLineSeires = chart.addSeries(CandlestickSeries);

    // 資料
    const data = [
      { time: 1755610933, open: 100, high: 105, low: 98, close: 103 },
      { time: 1755610993, open: 103, high: 108, low: 101, close: 106 },
      { time: 1755611053, open: 106, high: 112, low: 105, close: 109 }
    ]as CandlestickData<UTCTimestamp>[];

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

    //#region draw corresponding marker 
    console.log('strategy:', strategyValue, 'symbol:', symbolValue)
    // Retrieve the markers directly in a single line
    const chartMarkers = allMarkersByStrategy.get(strategyValue)?.get(symbolValue) || [];
    // Now `chartMarkers` is either an array of the correct markers or an empty array
    console.log(chartMarkers);

    createSeriesMarkers(kLineSeires, chartMarkers);
    //endregion

    //#region update kline realtime
     if (!wsRef.current) {
    wsRef.current = new WebSocket('ws://localhost:8080');
    wsRef.current.onopen = () => console.log('Connected');
    wsRef.current.onmessage = (msg) => { const { type, data } = JSON.parse(msg.data);
      if (type === "candle") {
        kLineSeires.update(data); // lightweight-charts 的 API
      }}
  }

        //endregion
    return () => {
      wsRef.current?.close();
      wsRef.current = null;
      chart.remove()}; // 清理圖表，避免重複 render
  }, [mode, strategyValue, symbolValue]); // mode 或 value 改變就重新畫圖

  return <div ref={chartContainer} />;
}
