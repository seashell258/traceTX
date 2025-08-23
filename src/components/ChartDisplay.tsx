import { strategies } from "../configs/StrategyAndSymbols";
import { allMarkersByStrategy, allMarkersBySymbol } from "./tx-log";
import { createSeriesMarkers, createChart, CandlestickSeries } from "lightweight-charts";
import type { SeriesMarker, UTCTimestamp, CandlestickData } from 'lightweight-charts';
import { useEffect, useRef } from "react";


interface Props {
  mode: "strategy" | "symbol";
  strategyValue: string;
  symbolValue: string
}



export default function ChartDisplay({ mode, strategyValue, symbolValue }: Props) {
  const chartContainer = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    if (!chartContainer.current) return;

    // 建立圖表
    const chart = createChart(chartContainer.current!, {
      width: 900, height: 600, timeScale: {
        timeVisible: true
      }
    });
    /*
        // 指定線圖 series 型別
        const kLineSeries = chart.addSeries(CandlestickSeries);
    
    
        const fetchData = async (ticker: string) => {
          const res = await fetch(`/api/kline?ticker=${ticker}`);
          const data = await res.json() as CandlestickData<UTCTimestamp>[];
          kLineSeries.setData(data); // 更新圖表
        };
        fetchData(symbolValue)
        */

    // 用 Map 存每個 ticker 的 series
    const seriesMap = new Map<string, ReturnType<typeof chart.addSeries>>();

    // 動態抓資料並建立 series
    const fetchData = async (ticker: string) => {
      // 如果這個 ticker 還沒 series，先新增
      if (!seriesMap.has(ticker)) {
        const newSeries = chart.addSeries(CandlestickSeries, { title: ticker });
        seriesMap.set(ticker, newSeries);
      }

      const res = await fetch(`/api/kline?ticker=${ticker}`);
      const data = await res.json();

      // 更新對應 series
      seriesMap.get(ticker)!.setData(data);
    };

    // 範例：動態切換 ticker
    fetchData(symbolValue);
    /*
        const data = [
          { time: 1755610933, open: 100, high: 105, low: 98, close: 103 },
          { time: 1755610993, open: 103, high: 108, low: 101, close: 106 },
          { time: 1755611053, open: 106, high: 112, low: 105, close: 109 }
        ] as CandlestickData<UTCTimestamp>[];
    
        kLineSeries.setData(data);
    */

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

    //原本填的是klineseries
    createSeriesMarkers(seriesMap.get(symbolValue)!, chartMarkers);
    //endregion

    //#region update kline realtime
    if (!wsRef.current) {
      wsRef.current = new WebSocket('ws://localhost:3000');
      wsRef.current.onopen = () => console.log('Connected');
      wsRef.current.onmessage = (msg) => {
        const { type, data } = JSON.parse(msg.data);
        if (type === "candle") {
          seriesMap.get(symbolValue)!.update(data); // lightweight-charts 的 API
        }
      }
    }

    //endregion
    return () => {
      wsRef.current?.close();
      wsRef.current = null;
      chart.remove()
    }; // 清理圖表，避免重複 render
  }, [mode, strategyValue, symbolValue]); // mode 或 value 改變就重新畫圖

  return <div ref={chartContainer} />;
}
